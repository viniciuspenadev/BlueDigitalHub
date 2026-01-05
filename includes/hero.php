<?php
// includes/hero.php
?>
<section class="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#0000bf]">

    <!-- Background Elements -->
    <div class="absolute inset-0 z-0">
        <!-- Gradient Mesh -->
        <div class="absolute inset-0 bg-gradient-to-br from-[#0000bf] via-[#062bb0] to-[#0c46e6]"></div>

        <!-- Technical Grid -->
        <div
            class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]">
        </div>

        <!-- Large Geometric Circles -->
        <div
            class="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] border border-white/5 rounded-full">
        </div>
        <div
            class="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] border border-white/5 rounded-full">
        </div>
    </div>

    <div class="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <!-- Left Column: Typography -->
            <div class="max-w-3xl">
                <div class="inline-flex items-center space-x-2 mb-8">
                    <span class="h-px w-8 bg-white/50"></span>
                    <span class="text-blue-200 font-mono text-xs uppercase tracking-[0.2em]">
                        <?php echo $t['hero_badge']; ?>
                    </span>
                </div>

                <h1 class="text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.95] mb-8 text-white">
                    <?php echo $t['hero_title_1']; ?> <br />
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 opacity-90">
                        <?php echo $t['hero_title_highlight']; ?>.
                    </span>
                </h1>

                <p class="text-xl text-blue-100/80 font-light leading-relaxed max-w-lg mb-10">
                    <?php echo $t['hero_subtitle']; ?>
                </p>

                <div class="flex flex-col sm:flex-row gap-5">
                    <a href="#contact"
                        class="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#0000bf] bg-white rounded-full overflow-hidden transition-transform hover:scale-105">
                        <span class="relative z-10 flex items-center">
                            <?php echo $t['hero_cta_primary']; ?> <i data-lucide="arrow-right"
                                class="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"></i>
                        </span>
                        <div
                            class="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300">
                        </div>
                    </a>

                    <a href="#portfolio"
                        class="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border border-white/30 rounded-full hover:bg-white/10 transition-all backdrop-blur-sm">
                        <i data-lucide="play" class="mr-2 h-4 w-4 fill-current"></i>
                        <?php echo $t['hero_cta_secondary']; ?>
                    </a>
                </div>
            </div>

            <!-- Right Column: The "Hub" Visualization -->
            <div class="relative hidden lg:block h-[600px] w-full">

                <!-- Connection Lines (SVG) -->
                <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0">
                    <line x1="50%" y1="50%" x2="20%" y2="15%" stroke="white" strokeWidth="1" strokeDasharray="6 4" />
                    <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="white" strokeWidth="1" strokeDasharray="6 4" />
                    <line x1="50%" y1="50%" x2="85%" y2="80%" stroke="white" strokeWidth="1" strokeDasharray="6 4" />
                    <line x1="50%" y1="50%" x2="25%" y2="85%" stroke="white" strokeWidth="1" strokeDasharray="6 4" />
                </svg>

                <!-- Center Core -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div
                        class="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.2)] animate-pulse">
                        <i data-lucide="zap" class="h-12 w-12 text-[#0c46e6]"></i>
                    </div>
                    <!-- Orbital Rings -->
                    <div class="absolute inset-0 -m-4 border border-white/20 rounded-full w-40 h-40 animate-spin-slow"
                        style="animation: spin 10s linear infinite;"></div>
                    <div class="absolute inset-0 -m-12 border border-white/10 rounded-full w-56 h-56"></div>
                </div>

                <!-- Node 1: Web (Top Left) -->
                <div class="absolute top-16 left-0 p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl w-60 z-20 floating-element"
                    style="animation-delay: 0s;">
                    <div class="flex items-center mb-3">
                        <div class="p-2 bg-[#0c46e6] rounded-lg mr-3">
                            <i data-lucide="globe" class="h-4 w-4 text-white"></i>
                        </div>
                        <span class="font-bold text-sm">Web Platform</span>
                    </div>
                    <div class="space-y-2">
                        <div class="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div class="h-full bg-white w-3/4"></div>
                        </div>
                        <div class="flex justify-between text-[10px] text-blue-200">
                            <span>Performance</span>
                            <span class="text-white font-bold">99.9%</span>
                        </div>
                    </div>
                </div>

                <!-- Node 2: App Nativo (Middle Right) -->
                <div class="absolute top-20 right-2 p-5 bg-[#0c46e6] border border-white/20 rounded-2xl w-64 shadow-2xl z-20 floating-element"
                    style="animation-delay: 1.5s;">
                    <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                        <div class="flex items-center">
                            <div class="p-1.5 bg-white rounded-md mr-2">
                                <i data-lucide="smartphone" class="h-4 w-4 text-[#0000bf]"></i>
                            </div>
                            <span class="font-bold text-sm">App Nativo</span>
                        </div>
                        <div class="flex items-center bg-[#0000bf]/30 px-2 py-1 rounded-full">
                            <i data-lucide="star" class="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1"></i>
                            <span class="text-xs font-bold text-white">4.9/5</span>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div class="flex items-center text-xs text-blue-100">
                            <i data-lucide="check" class="h-3 w-3 mr-2 text-green-400"></i>
                            <span>iOS & Android (Híbrido)</span>
                        </div>
                        <div class="flex items-center text-xs text-blue-100">
                            <i data-lucide="check" class="h-3 w-3 mr-2 text-green-400"></i>
                            <span>Publicação nas Lojas</span>
                        </div>
                        <div class="flex items-center text-xs text-blue-100">
                            <i data-lucide="check" class="h-3 w-3 mr-2 text-green-400"></i>
                            <span>UX Otimizada</span>
                        </div>
                    </div>
                </div>

                <!-- Node 3: Product Design (Bottom Right) -->
                <div class="absolute bottom-16 right-0 p-5 bg-[#0000bf] border border-white/20 rounded-2xl w-56 shadow-xl z-20 floating-element"
                    style="animation-delay: 2s;">
                    <div class="flex items-center mb-3">
                        <div class="p-2 bg-pink-500 rounded-lg mr-3">
                            <i data-lucide="palette" class="h-4 w-4 text-white"></i>
                        </div>
                        <span class="font-bold text-sm">Product Design</span>
                    </div>
                    <div class="flex items-center space-x-2 mt-2">
                        <div
                            class="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-serif">
                            Aa</div>
                        <div
                            class="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 ring-2 ring-[#0000bf]">
                        </div>
                        <div
                            class="h-8 w-8 rounded-full bg-white/10 border border-white/40 backdrop-blur-sm -ml-4 flex items-center justify-center text-[10px]">
                            +UI</div>
                    </div>
                </div>

                <!-- Node 4: Branding (Bottom Left) -->
                <div class="absolute bottom-4 left-4 p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl w-64 z-20 floating-element"
                    style="animation-delay: 1s;">
                    <div class="flex items-center mb-3">
                        <div class="p-2 bg-emerald-500 rounded-lg mr-3">
                            <i data-lucide="fingerprint" class="h-4 w-4 text-white"></i>
                        </div>
                        <span class="font-bold text-sm">Branding</span>
                    </div>
                    <div class="text-xs text-blue-100 space-y-2">
                        <div class="flex items-center justify-between">
                            <span>Identidade Visual</span>
                            <span class="text-emerald-400 font-bold">100%</span>
                        </div>
                        <div class="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-2">
                            <div class="w-full h-full bg-emerald-400"></div>
                        </div>

                        <div class="flex items-center pt-1 border-t border-white/5">
                            <i data-lucide="layout" class="h-3 w-3 mr-2 text-blue-200"></i>
                            <span>Manual da Marca</span>
                        </div>
                        <div class="flex items-center">
                            <i data-lucide="type" class="h-3 w-3 mr-2 text-blue-200"></i>
                            <span>Tom de Voz & Verbal</span>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
</section>