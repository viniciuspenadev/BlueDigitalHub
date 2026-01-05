<?php
// includes/ai-consultant.php
?>
<div id="ai-widget-container" class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">

    <!-- Chat Window -->
    <div id="ai-chat-window" class="
        hidden
        absolute bottom-20 right-0
        transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform origin-bottom-right
        bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl shadow-[#0000bf]/20 rounded-[2rem] overflow-hidden
        w-[calc(100vw-2rem)] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col
    ">
        <!-- Header -->
        <div
            class="bg-gradient-to-r from-[#0000bf] to-[#0c46e6] p-5 flex items-center justify-between shrink-0 relative overflow-hidden">
            <!-- Abstract Background Shapes -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

            <div class="flex items-center text-white relative z-10">
                <div class="relative">
                    <div class="bg-white/10 p-2.5 rounded-2xl mr-3 shadow-lg backdrop-blur-sm">
                        <i data-lucide="bot" class="h-6 w-6 text-white"></i>
                    </div>
                    <span
                        class="absolute bottom-0 right-2 w-3 h-3 bg-green-400 border-2 border-[#0000bf] rounded-full"></span>
                </div>
                <div>
                    <h3 class="font-bold text-base leading-tight">Bia AI</h3>
                    <p class="text-xs text-blue-200 font-medium">
                        <?php echo $t['ai_consultant_label']; ?>
                    </p>
                </div>
            </div>
            <button id="ai-close-btn"
                class="text-blue-200 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors relative z-10">
                <i data-lucide="chevron-down" class="h-5 w-5"></i>
            </button>
        </div>

        <!-- Messages Area -->
        <div id="ai-messages"
            class="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <!-- Initial Greeting -->
            <div class="flex w-full justify-start">
                <div class="flex flex-col max-w-[85%] items-start">
                    <span class="text-[10px] text-slate-400 mb-1 px-1">Bia</span>
                    <div
                        class="p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm relative break-words whitespace-pre-wrap bg-white border border-slate-100 text-slate-700 rounded-tl-sm">
                        <?php echo $t['ai_greeting']; ?>
                    </div>
                </div>
            </div>

            <!-- Typing Indicator (Hidden by default) -->
            <div id="ai-typing-indicator" class="hidden flex w-full justify-start">
                <div
                    class="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-1">
                    <span class="w-2 h-2 bg-[#0c46e6] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span class="w-2 h-2 bg-[#0c46e6] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span class="w-2 h-2 bg-[#0c46e6] rounded-full animate-bounce"></span>
                </div>
            </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 bg-white border-t border-slate-100 shrink-0">
            <div
                class="flex items-end bg-slate-50 rounded-[1.5rem] border border-slate-200 pl-4 pr-2 py-2 focus-within:border-[#0c46e6] focus-within:ring-2 focus-within:ring-[#0c46e6]/20 transition-all shadow-inner">
                <textarea id="ai-input" placeholder="<?php echo $t['ai_placeholder']; ?>" rows="1"
                    class="flex-1 bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400 text-sm resize-none py-2.5 max-h-24 scrollbar-hide"
                    style="min-height: 44px"></textarea>
                <button id="ai-send-btn" disabled
                    class="h-10 w-10 ml-2 mb-0.5 rounded-full flex items-center justify-center transition-all duration-300 bg-slate-200 text-slate-400 cursor-not-allowed disabled:cursor-not-allowed">
                    <i data-lucide="send" class="h-4 w-4 ml-0.5"></i>
                </button>
            </div>
            <div class="text-center mt-2">
                <span class="text-[10px] text-slate-400 flex items-center justify-center">
                    <i data-lucide="sparkles" class="w-3 h-3 mr-1 text-[#0c46e6]"></i>
                    BlueDigital AI
                </span>
            </div>
        </div>
    </div>

    <!-- Floating Toggle Button -->
    <button id="ai-toggle-btn"
        class="group relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl shadow-[#0c46e6]/40 z-50 transition-all duration-500 bg-gradient-to-r from-[#0000bf] to-[#0c46e6] hover:scale-105">
        <i data-lucide="message-circle"
            class="h-8 w-8 text-white absolute transition-opacity duration-300 group-hover:opacity-0"
            id="ai-toggle-icon-msg"></i>
        <i data-lucide="sparkles"
            class="h-7 w-7 text-white absolute opacity-0 transition-opacity duration-300 group-hover:opacity-100 rotate-12"></i>
        <i data-lucide="x" class="h-6 w-6 text-white absolute opacity-0 transition-transform hidden"
            id="ai-toggle-icon-close"></i>

        <!-- Notification Badge -->
        <span id="ai-badge" class="absolute top-0 right-0 flex h-4 w-4">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
        </span>
    </button>
</div>