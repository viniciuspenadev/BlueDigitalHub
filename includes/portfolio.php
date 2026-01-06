<?php
// includes/portfolio.php

$projects_list = [
    [
        'title' => $t['project_1_title'],
        'category' => $t['project_1_cat'],
        'desc' => $t['project_1_desc'],
        // Real Fresh Fish Market / Seafood Display
        'image' => 'assets/image/raw-salmon-file-gray-board-black-surface-convertido-de-jpg (1).webp',
        'tags' => ['App Nativo', 'Web System', 'Marketing']
    ],
    [
        'title' => $t['project_2_title'],
        'category' => $t['project_2_cat'],
        'desc' => $t['project_2_desc'],
        // Students with technology / Realistic Classroom
        'image' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070',
        'tags' => ['TypeScript', 'PostgreSQL', 'PWA']
    ],
    [
        'title' => $t['project_3_title'],
        'category' => $t['project_3_cat'],
        'desc' => $t['project_3_desc'],
        // Majestic Cargo Ship / Container Port
        'image' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070',
        'tags' => ['PHP', 'Tailwind', 'Google Ads']
    ],
    [
        'title' => $t['project_4_title'],
        'category' => $t['project_4_cat'],
        'desc' => $t['project_4_desc'],
        // Designer Desk / Pantone / Creative Studio
        'image' => 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2064',
        'tags' => ['Identity', 'Figma', 'Print']
    ],
    [
        'title' => $t['project_5_title'],
        'category' => $t['project_5_cat'],
        'desc' => $t['project_5_desc'],
        // Modern Architecture / Construction Site
        'image' => 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070',
        'tags' => ['App IOS/Android', 'Web', 'Social']
    ],
];
?>
<section id="portfolio" class="py-24 bg-white relative overflow-hidden">

    <!-- Decorative Background -->
    <div
        class="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-60 pointer-events-none">
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <!-- Header & Controls -->
        <div class="flex flex-col md:flex-row justify-between items-end mb-12">
            <div class="max-w-xl">
                <div
                    class="flex items-center space-x-2 text-[#0c46e6] font-mono text-xs tracking-widest uppercase mb-3">
                    <i data-lucide="layers" class="w-4 h-4"></i>
                    <span>
                        <?php echo $t['portfolio_label']; ?>
                    </span>
                </div>
                <h2 class="text-4xl lg:text-5xl font-bold text-[#0000bf] mb-4 tracking-tight">
                    <?php echo $t['portfolio_title']; ?>
                </h2>
                <p class="text-slate-500 text-lg">
                    <?php echo $t['portfolio_subtitle']; ?>
                </p>
            </div>

            <!-- Desktop Navigation Buttons -->
            <div class="hidden md:flex items-center space-x-4">
                <button id="portfolio-scroll-left"
                    class="p-4 rounded-full border border-slate-200 hover:border-[#0c46e6] hover:bg-[#0c46e6] text-slate-400 hover:text-white transition-all duration-300 group shadow-sm">
                    <i data-lucide="arrow-left" class="w-6 h-6 group-hover:-translate-x-1 transition-transform"></i>
                </button>
                <button id="portfolio-scroll-right"
                    class="p-4 rounded-full border border-slate-200 hover:border-[#0c46e6] hover:bg-[#0c46e6] text-slate-400 hover:text-white transition-all duration-300 group shadow-sm">
                    <i data-lucide="arrow-right" class="w-6 h-6 group-hover:translate-x-1 transition-transform"></i>
                </button>
            </div>
        </div>

        <!-- Horizontal Scroll Stream -->
        <div id="portfolio-scroll-container"
            class="flex space-x-6 overflow-x-auto pb-16 pt-4 snap-x snap-mandatory scrollbar-hide"
            style="scrollbar-width: none; -ms-overflow-style: none;">
            <?php foreach ($projects_list as $index => $project): ?>
                <div class="
              portfolio-card
              relative min-w-[320px] md:min-w-[420px] h-[520px] rounded-[2rem] overflow-hidden snap-center cursor-pointer group select-none
              bg-[#0000bf] z-10 shadow-lg
            ">
                    <!-- Image & Overlay -->
                    <div class="absolute inset-0 h-3/5 overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#0000bf] z-10"></div>
                        <img src="<?php echo $project['image']; ?>" alt="<?php echo $project['title']; ?>"
                            class="w-full h-full object-cover" />
                        <!-- Category Tag -->
                        <div class="absolute top-6 right-6 z-20">
                            <span
                                class="bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                <?php echo $project['category']; ?>
                            </span>
                        </div>
                    </div>

                    <!-- Content Card -->
                    <div class="absolute inset-0 flex flex-col justify-end p-8 z-20">
                        <div class="">
                            <!-- Title -->
                            <div class="flex justify-between items-center mb-3">
                                <h3 class="text-2xl font-bold text-white leading-tight">
                                    <?php echo $project['title']; ?>
                                </h3>
                                <div class="w-8 h-8 rounded-full bg-[#0c46e6] flex items-center justify-center text-white">
                                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                                </div>
                            </div>

                            <!-- Description -->
                            <p class="text-blue-100 text-sm leading-relaxed mb-6 line-clamp-3">
                                <?php echo $project['desc']; ?>
                            </p>

                            <!-- Tech Stack Chips -->
                            <div class="flex flex-wrap gap-2 mb-4">
                                <?php foreach ($project['tags'] as $i => $tag): ?>
                                    <span
                                        class="flex items-center text-[10px] font-mono font-medium text-blue-100 bg-blue-900/50 border border-blue-700 px-2.5 py-1 rounded">
                                        <?php if ($i === 0)
                                            echo '<i data-lucide="code-2" class="w-3 h-3 mr-1.5 opacity-70"></i>'; ?>
                                        <?php if ($i === 1)
                                            echo '<i data-lucide="cpu" class="w-3 h-3 mr-1.5 opacity-70"></i>'; ?>
                                        <?php if ($i === 2)
                                            echo '<i data-lucide="database" class="w-3 h-3 mr-1.5 opacity-70"></i>'; ?>
                                        <?php echo $tag; ?>
                                    </span>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>

            <!-- End Padding -->
            <div class="min-w-[50px]"></div>
        </div>

        <!-- Scroll Progress Indicator -->
        <div class="w-full h-[2px] bg-slate-200 rounded-full mt-4 overflow-hidden max-w-7xl mx-auto">
            <div id="portfolio-progress-bar" class="h-full bg-[#0c46e6] transition-all duration-100 ease-out"
                style="width: 0%"></div>
        </div>

    </div>
</section>