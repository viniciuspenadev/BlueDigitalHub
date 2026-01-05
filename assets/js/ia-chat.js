// assets/js/ia-chat.js

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('ai-widget-container');
    const chatWindow = document.getElementById('ai-chat-window');
    const toggleBtn = document.getElementById('ai-toggle-btn');
    const closeBtn = document.getElementById('ai-close-btn');
    const iconMsg = document.getElementById('ai-toggle-icon-msg');
    const iconClose = document.getElementById('ai-toggle-icon-close');
    const badge = document.getElementById('ai-badge');

    const messagesDiv = document.getElementById('ai-messages');
    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send-btn');
    const typingIndicator = document.getElementById('ai-typing-indicator');

    let isOpen = false;
    let isTyping = false;
    let chatHistory = []; // Needed to send context to backend

    // --- Toggle Logic ---
    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            chatWindow.classList.remove('hidden', 'scale-75', 'opacity-0', 'translate-y-8', 'pointer-events-none');
            chatWindow.classList.add('scale-100', 'opacity-100', 'translate-y-0');

            toggleBtn.classList.add('bg-[#0000bf]', 'rotate-90', 'scale-90');
            toggleBtn.classList.remove('bg-gradient-to-r');

            iconMsg.classList.add('hidden');
            iconClose.classList.remove('hidden');
            iconClose.classList.add('opacity-100');

            badge.classList.add('hidden'); // Hide badge when opened
            setTimeout(() => input.focus(), 300);
        } else {
            chatWindow.classList.add('scale-75', 'opacity-0', 'translate-y-8', 'pointer-events-none');
            chatWindow.classList.remove('scale-100', 'opacity-100', 'translate-y-0');
            // Wait for animation to finish before hiding display
            setTimeout(() => chatWindow.classList.add('hidden'), 300);

            toggleBtn.classList.remove('bg-[#0000bf]', 'rotate-90', 'scale-90');
            toggleBtn.classList.add('bg-gradient-to-r');

            iconMsg.classList.remove('hidden');
            iconClose.classList.add('hidden');
            iconClose.classList.remove('opacity-100');
        }

        // Re-render icons if needed (though toggling classes usually enough for visibility)
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // --- Input Logic ---
    input.addEventListener('input', () => {
        if (input.value.trim() && !isTyping) {
            sendBtn.disabled = false;
            sendBtn.classList.remove('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
            sendBtn.classList.add('bg-[#0c46e6]', 'text-white', 'shadow-lg');
        } else {
            sendBtn.disabled = true;
            sendBtn.classList.add('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
            sendBtn.classList.remove('bg-[#0c46e6]', 'text-white', 'shadow-lg');
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    function scrollToBottom() {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // --- Message Logic ---
    async function sendMessage() {
        const text = input.value.trim();
        if (!text || isTyping) return;

        // User Message UI
        appendMessage('user', text);
        chatHistory.push({ role: 'user', parts: [{ text: text }] });

        input.value = '';
        sendBtn.disabled = true;
        isTyping = true;

        // Show typing indicator
        typingIndicator.classList.remove('hidden');
        scrollToBottom();

        try {
            // Prepare Model Message UI
            const modelMsgElement = createMessageElement('model', '');
            messagesDiv.insertBefore(modelMsgElement, typingIndicator);
            const textContainer = modelMsgElement.querySelector('.message-text');

            // Fetch from Backend
            const response = await fetch('api/chat.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: chatHistory,
                    // We don't need to send 'message' separately as it's in history, 
                    // but depending on backend impl, we might. Let's send history including the new msg.
                })
            });

            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                // Simple implementation: Backend returns raw text chunks. 
                // Enhanced impl would return SSE events to separate text from tool calls.
                // Assuming backend sends raw text for now.
                fullResponse += chunk;
                textContainer.innerHTML = formatText(fullResponse);
                scrollToBottom();
            }

            chatHistory.push({ role: 'model', parts: [{ text: fullResponse }] });

        } catch (error) {
            console.error(error);
            appendMessage('model', 'Desculpe, tive um erro de conexão.');
        } finally {
            isTyping = false;
            typingIndicator.classList.add('hidden');
            scrollToBottom();
        }
    }

    function appendMessage(role, text) {
        const msgEl = createMessageElement(role, text);
        messagesDiv.insertBefore(msgEl, typingIndicator);
        scrollToBottom();
    }

    function createMessageElement(role, text) {
        const div = document.createElement('div');
        div.className = `flex w-full ${role === 'user' ? 'justify-end' : 'justify-start'}`;

        const label = role === 'user' ? 'Você' : 'Bia';
        const bgClass = role === 'user'
            ? 'bg-[#0000bf] text-white rounded-tr-sm shadow-[#0000bf]/20'
            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm';

        div.innerHTML = `
            <div class="flex flex-col max-w-[85%] ${role === 'user' ? 'items-end' : 'items-start'}">
                <span class="text-[10px] text-slate-400 mb-1 px-1">${label}</span>
                <div class="message-text p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm relative break-words whitespace-pre-wrap ${bgClass}">
                    ${formatText(text)}
                </div>
            </div>
        `;
        return div;
    }

    function formatText(text) {
        // Basic markdown formatting if needed (bold, newlines)
        return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    }
});
