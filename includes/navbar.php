<?php
// includes/navbar.php
?>
<nav class="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[90%] md:w-auto flex items-center justify-center">
    <!-- Glass Panel -->
    <div
        class="bg-white/95 backdrop-blur-xl border border-white/50 rounded-full px-2 py-2 md:px-6 md:py-3 flex items-center justify-between md:justify-center shadow-xl shadow-black/5">

        <!-- Logo (Mobile Only) -->
        <div class="md:hidden flex items-center pl-4">
            <i data-lucide="zap" class="h-6 w-6 text-[#0c46e6] mr-2"></i>
            <span class="font-bold text-[#0000bf]">BlueDigital</span>
        </div>

        <!-- Desktop Menu -->
        <ul class="hidden md:flex items-center space-x-2">
            <li class="mr-6 flex items-center pr-6 border-r border-slate-200">
                <i data-lucide="zap" class="h-5 w-5 text-[#0c46e6] mr-2 fill-current"></i>
                <span class="font-bold text-lg text-[#0000bf] tracking-tight">BlueDigital<span
                        class="font-light text-[#0c46e6]">Hub</span></span>
            </li>

            <li>
                <a href="#services"
                    class="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-[#0c46e6] transition-all duration-300">
                    <i data-lucide="layers" class="w-4 h-4"></i>
                    <span>
                        <?php echo $t['nav_services']; ?>
                    </span>
                </a>
            </li>
            <li>
                <a href="#portfolio"
                    class="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-[#0c46e6] transition-all duration-300">
                    <i data-lucide="briefcase" class="w-4 h-4"></i>
                    <span>
                        <?php echo $t['nav_portfolio']; ?>
                    </span>
                </a>
            </li>
            <li>
                <a href="#contact"
                    class="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-[#0c46e6] transition-all duration-300">
                    <i data-lucide="message-square" class="w-4 h-4"></i>
                    <span>
                        <?php echo $t['nav_contact']; ?>
                    </span>
                </a>
            </li>

            <li class="ml-2">
                <a href="#contact"
                    class="bg-[#0c46e6] hover:bg-[#0000bf] text-white px-6 py-2.5 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-[#0c46e6]/30 transform hover:-translate-y-0.5 text-sm">
                    <?php echo $t['nav_start_project']; ?>
                </a>
            </li>
        </ul>

        <!-- Mobile Menu Button -->
        <div class="md:hidden pr-2">
            <button id="mobile-menu-btn"
                class="p-2 text-slate-600 hover:text-[#0c46e6] bg-slate-100 rounded-full shadow-sm">
                <!-- Icon toggled via JS -->
                <i data-lucide="menu" class="h-5 w-5" id="mobile-menu-icon"></i>
            </button>
        </div>
    </div>

    <!-- Language Switcher (Floating Pill) -->
    <!-- Language Switcher (Sleek Satellite - No BG) -->
    <!-- Language Switcher (iOS Segmented Control) -->
    <!-- Language Switcher (High-Fidelity Images) -->
    <div class="hidden md:flex items-center gap-2 ml-5">
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
</nav>

<!-- Mobile Menu Dropdown -->
<div id="mobile-menu-dropdown" class="hidden fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-40 md:hidden">
    <div
        class="bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-top-4 duration-300">
        <div class="flex flex-col space-y-2">
            <a href="#services"
                class="mobile-link flex items-center p-3 rounded-xl hover:bg-blue-50 text-slate-700 font-medium transition-colors">
                <span class="p-2 bg-blue-100 rounded-lg text-[#0c46e6] mr-3">
                    <i data-lucide="layers" class="w-4 h-4"></i>
                </span>
                <?php echo $t['nav_services']; ?>
            </a>
            <a href="#portfolio"
                class="mobile-link flex items-center p-3 rounded-xl hover:bg-blue-50 text-slate-700 font-medium transition-colors">
                <span class="p-2 bg-blue-100 rounded-lg text-[#0c46e6] mr-3">
                    <i data-lucide="briefcase" class="w-4 h-4"></i>
                </span>
                <?php echo $t['nav_portfolio']; ?>
            </a>
            <a href="#contact"
                class="mobile-link flex items-center p-3 rounded-xl hover:bg-blue-50 text-slate-700 font-medium transition-colors">
                <span class="p-2 bg-blue-100 rounded-lg text-[#0c46e6] mr-3">
                    <i data-lucide="message-square" class="w-4 h-4"></i>
                </span>
                <?php echo $t['nav_contact']; ?>
            </a>

            <a href="#contact"
                class="mobile-link mt-4 block w-full text-center bg-[#0c46e6] text-white font-bold py-3 rounded-xl shadow-lg shadow-[#0c46e6]/20">
                <?php echo $t['nav_start_project']; ?>
            </a>
        </div>
    </div>
</div>