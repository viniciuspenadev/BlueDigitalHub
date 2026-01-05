<?php
// includes/navbar.php
?>
<nav id="navbar"
    class="fixed z-50 transition-all duration-300 w-full top-0 md:top-6 md:w-auto md:left-1/2 md:-translate-x-1/2">

    <!-- Mobile Header (Full Width) -->
    <div
        class="md:hidden w-full bg-white/90 backdrop-blur-xl border-b border-white/50 px-6 py-4 flex items-center justify-between shadow-sm">
        <!-- Logo Left -->
        <a href="#" class="flex items-center group">
            <i data-lucide="zap" class="h-6 w-6 text-[#0c46e6] mr-2 group-hover:scale-110 transition-transform"></i>
            <span class="font-bold text-xl text-[#0000bf] tracking-tight">BlueDigital<span
                    class="font-light text-[#0c46e6]">Hub</span></span>
        </a>

        <!-- Burger Right -->
        <button id="mobile-menu-btn"
            class="p-2 -mr-2 text-slate-700 hover:text-[#0c46e6] active:scale-95 transition-all">
            <i data-lucide="menu" class="h-7 w-7"></i>
        </button>
    </div>

    <!-- Desktop Glass Pill (Original Design) -->
    <div
        class="hidden md:flex bg-white/95 backdrop-blur-xl border border-white/50 rounded-full px-6 py-3 items-center justify-center shadow-xl shadow-black/5">

        <ul class="flex items-center space-x-2">
            <!-- Desktop Logo -->
            <li class="mr-6 flex items-center pr-6 border-r border-slate-200">
                <a href="#" class="flex items-center group">
                    <i data-lucide="zap"
                        class="h-5 w-5 text-[#0c46e6] mr-2 fill-current group-hover:scale-110 transition-transform"></i>
                    <span class="font-bold text-lg text-[#0000bf] tracking-tight">BlueDigital<span
                            class="font-light text-[#0c46e6]">Hub</span></span>
                </a>
            </li>

            <li>
                <a href="#services"
                    class="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-[#0c46e6] transition-all duration-300">
                    <i data-lucide="layers" class="w-4 h-4"></i>
                    <span><?php echo $t['nav_services']; ?></span>
                </a>
            </li>
            <li>
                <a href="#portfolio"
                    class="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-[#0c46e6] transition-all duration-300">
                    <i data-lucide="briefcase" class="w-4 h-4"></i>
                    <span><?php echo $t['nav_portfolio']; ?></span>
                </a>
            </li>
            <li>
                <a href="#contact"
                    class="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-[#0c46e6] transition-all duration-300">
                    <i data-lucide="message-square" class="w-4 h-4"></i>
                    <span><?php echo $t['nav_contact']; ?></span>
                </a>
            </li>

            <li class="ml-2">
                <a href="#contact"
                    class="bg-[#0c46e6] hover:bg-[#0000bf] text-white px-6 py-2.5 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-[#0c46e6]/30 transform hover:-translate-y-0.5 text-sm">
                    <?php echo $t['nav_start_project']; ?>
                </a>
            </li>
        </ul>

        <!-- Desktop Language Switcher -->
        <div class="flex items-center gap-2 ml-5 border-l border-slate-200 pl-5">
            <a href="?lang=pt" title="Português" class="group transition-all duration-300">
                <div
                    class="w-5 h-5 rounded-full overflow-hidden shadow-sm transition-all duration-300 ring-1 ring-slate-200/50 <?php echo ($lang === 'pt') ? 'opacity-100 scale-110 shadow-md ring-slate-300' : 'opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110'; ?>">
                    <img src="https://flagcdn.com/w40/br.png" alt="Brasil" class="w-full h-full object-cover">
                </div>
            </a>
            <div class="w-px h-3 bg-slate-300/30 rounded-full"></div>
            <a href="?lang=en" title="English" class="group transition-all duration-300">
                <div
                    class="w-5 h-5 rounded-full overflow-hidden shadow-sm transition-all duration-300 ring-1 ring-slate-200/50 <?php echo ($lang === 'en') ? 'opacity-100 scale-110 shadow-md ring-slate-300' : 'opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110'; ?>">
                    <img src="https://flagcdn.com/w40/us.png" alt="USA" class="w-full h-full object-cover">
                </div>
            </a>
        </div>
    </div>
</nav>

<!-- Mobile Overlay Menu (Drawer) -->
<div id="mobile-menu-overlay"
    class="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300 md:hidden">
</div>

<div id="mobile-menu-drawer"
    class="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[70] shadow-2xl transform translate-x-full transition-transform duration-300 ease-out md:hidden flex flex-col">
    <!-- Drawer Header -->
    <div class="p-6 flex items-center justify-between border-b border-slate-100">
        <span class="font-bold text-lg text-slate-800">Menu</span>
        <button id="mobile-menu-close"
            class="p-2 -mr-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-all">
            <i data-lucide="x" class="h-6 w-6"></i>
        </button>
    </div>

    <!-- Drawer Content -->
    <div class="flex-1 overflow-y-auto p-6 flex flex-col">
        <!-- Navigation Links -->
        <nav class="space-y-4 mb-8">
            <a href="#services"
                class="mobile-link flex items-center p-3 rounded-2xl bg-slate-50 text-slate-600 font-medium hover:bg-blue-50 hover:text-[#0c46e6] transition-all group">
                <div
                    class="bg-white p-2 rounded-xl text-[#0c46e6] shadow-sm mr-4 group-hover:scale-110 transition-transform">
                    <i data-lucide="layers" class="w-5 h-5"></i>
                </div>
                <span class="text-lg"><?php echo $t['nav_services']; ?></span>
            </a>
            <a href="#portfolio"
                class="mobile-link flex items-center p-3 rounded-2xl bg-slate-50 text-slate-600 font-medium hover:bg-blue-50 hover:text-[#0c46e6] transition-all group">
                <div
                    class="bg-white p-2 rounded-xl text-[#0c46e6] shadow-sm mr-4 group-hover:scale-110 transition-transform">
                    <i data-lucide="briefcase" class="w-5 h-5"></i>
                </div>
                <span class="text-lg"><?php echo $t['nav_portfolio']; ?></span>
            </a>
            <a href="#contact"
                class="mobile-link flex items-center p-3 rounded-2xl bg-slate-50 text-slate-600 font-medium hover:bg-blue-50 hover:text-[#0c46e6] transition-all group">
                <div
                    class="bg-white p-2 rounded-xl text-[#0c46e6] shadow-sm mr-4 group-hover:scale-110 transition-transform">
                    <i data-lucide="message-square" class="w-5 h-5"></i>
                </div>
                <span class="text-lg"><?php echo $t['nav_contact']; ?></span>
            </a>
        </nav>

        <!-- CTA -->
        <a href="#contact"
            class="mobile-link w-full bg-[#0c46e6] text-white font-bold text-center py-4 rounded-2xl shadow-lg shadow-[#0c46e6]/20 hover:shadow-[#0c46e6]/40 hover:-translate-y-1 transition-all flex items-center justify-center mb-8">
            <?php echo $t['nav_start_project']; ?>
            <i data-lucide="arrow-right" class="w-5 h-5 ml-2"></i>
        </a>

        <!-- Language Switcher (Mobile) -->
        <div class="mt-auto">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Idioma / Language</p>
            <div class="flex gap-4">
                <a href="?lang=pt"
                    class="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all <?php echo ($lang === 'pt') ? 'border-[#0c46e6] bg-blue-50/50 text-[#0c46e6]' : 'border-slate-100 text-slate-500 hover:border-slate-200'; ?>">
                    <img src="https://flagcdn.com/w40/br.png" alt="Brasil" class="w-6 rounded-md shadow-sm">
                    <span class="font-medium">Português</span>
                </a>
                <a href="?lang=en"
                    class="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all <?php echo ($lang === 'en') ? 'border-[#0c46e6] bg-blue-50/50 text-[#0c46e6]' : 'border-slate-100 text-slate-500 hover:border-slate-200'; ?>">
                    <img src="https://flagcdn.com/w40/us.png" alt="USA" class="w-6 rounded-md shadow-sm">
                    <span class="font-medium">English</span>
                </a>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('mobile-menu-btn');
        const closeBtn = document.getElementById('mobile-menu-close');
        const drawer = document.getElementById('mobile-menu-drawer');
        const overlay = document.getElementById('mobile-menu-overlay');
        const links = document.querySelectorAll('.mobile-link');

        function toggleMenu() {
            // Toggle Overlay
            overlay.classList.toggle('hidden');
            setTimeout(() => overlay.classList.toggle('opacity-0'), 10); // Slight delay for fade

            // Toggle Drawer
            drawer.classList.toggle('translate-x-full');

            // Body Scroll Lock
            document.body.classList.toggle('overflow-hidden');
        }

        btn.addEventListener('click', toggleMenu);
        closeBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        links.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    });
</script>