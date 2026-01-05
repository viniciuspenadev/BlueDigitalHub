<?php
// includes/services.php

$services_list = [
    [
        'title' => $t['service_1_title'],
        'desc' => $t['service_1_desc'],
        'icon' => 'smartphone'
    ],
    [
        'title' => $t['service_2_title'],
        'desc' => $t['service_2_desc'],
        'icon' => 'globe'
    ],
    [
        'title' => $t['service_3_title'],
        'desc' => $t['service_3_desc'],
        'icon' => 'bar-chart-3'
    ],
    [
        'title' => $t['service_4_title'],
        'desc' => $t['service_4_desc'],
        'icon' => 'palette'
    ],
    [
        'title' => $t['service_5_title'],
        'desc' => $t['service_5_desc'],
        'icon' => 'shield-check'
    ],
    [
        'title' => $t['service_6_title'],
        'desc' => $t['service_6_desc'],
        'icon' => 'zap'
    ],
];
?>
<section id="services" class="py-24 bg-white relative border-t border-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16">
            <span class="text-[#0c46e6] font-bold tracking-wider uppercase text-sm mb-2 block">
                <?php echo $t['service_expert_label']; ?>
            </span>
            <h2 class="text-4xl font-bold text-slate-900 mb-4">
                <?php echo $t['services_title']; ?>
            </h2>
            <p class="text-slate-500 max-w-2xl mx-auto text-lg">
                <?php echo $t['services_subtitle']; ?>
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php foreach ($services_list as $service): ?>
                <div
                    class="bg-white border border-slate-100 p-8 rounded-[2rem] hover:shadow-xl hover:shadow-[#0c46e6]/10 hover:-translate-y-2 transition-all duration-300 group">
                    <div
                        class="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-[#0c46e6] mb-6 group-hover:bg-[#0c46e6] group-hover:text-white transition-all duration-300 shadow-sm">
                        <i data-lucide="<?php echo $service['icon']; ?>" class="h-8 w-8"></i>
                    </div>
                    <h3 class="text-xl font-bold text-[#0000bf] mb-3">
                        <?php echo $service['title']; ?>
                    </h3>
                    <p class="text-slate-500 leading-relaxed">
                        <?php echo $service['desc']; ?>
                    </p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>