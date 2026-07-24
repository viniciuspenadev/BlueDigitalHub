<?php
// includes/financial-solutions.php

$financial_features = [
    [
        'title' => $t['fin_feature_1_title'],
        'desc' => $t['fin_feature_1_desc'],
        'icon' => 'credit-card'
    ],
    [
        'title' => $t['fin_feature_2_title'],
        'desc' => $t['fin_feature_2_desc'],
        'icon' => 'bell-ring'
    ],
    [
        'title' => $t['fin_feature_3_title'],
        'desc' => $t['fin_feature_3_desc'],
        'icon' => 'smartphone'
    ],
    [
        'title' => $t['fin_feature_4_title'],
        'desc' => $t['fin_feature_4_desc'],
        'icon' => 'pie-chart'
    ],
];

$financial_benefits = [
    [
        'title' => $t['fin_benefit_1_title'],
        'desc' => $t['fin_benefit_1_desc'],
        'icon' => 'check-circle'
    ],
    [
        'title' => $t['fin_benefit_2_title'],
        'desc' => $t['fin_benefit_2_desc'],
        'icon' => 'clock'
    ],
    [
        'title' => $t['fin_benefit_3_title'],
        'desc' => $t['fin_benefit_3_desc'],
        'icon' => 'trending-up'
    ],
];
?>

<section id="financial-solutions" class="py-24 bg-slate-50 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
    <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Section Header -->
        <div class="text-center mb-20">
            <span class="text-[#0c46e6] font-bold tracking-wider uppercase text-sm mb-2 block">
                <?php echo $t['fin_section_label']; ?>
            </span>
            <h2 class="text-4xl font-bold text-slate-900 mb-6">
                <?php echo $t['fin_section_title']; ?>
            </h2>
            <p class="text-slate-500 max-w-3xl mx-auto text-lg leading-relaxed">
                <?php echo $t['fin_section_subtitle']; ?>
            </p>
        </div>

        <!-- Technical Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            <?php foreach ($financial_features as $feature): ?>
                <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                    <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0c46e6] mb-6">
                        <i data-lucide="<?php echo $feature['icon']; ?>" class="h-6 w-6"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-900 mb-3">
                        <?php echo $feature['title']; ?>
                    </h3>
                    <p class="text-slate-500 text-sm leading-relaxed">
                        <?php echo $feature['desc']; ?>
                    </p>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- Benefits & Value Proposition -->
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div class="grid grid-cols-1 lg:grid-cols-2">
                <div class="p-12 lg:p-16 flex flex-col justify-center">
                    <h3 class="text-3xl font-bold text-slate-900 mb-8">
                        <?php echo $t['fin_benefits_title']; ?>
                    </h3>
                    
                    <div class="space-y-8">
                        <?php foreach ($financial_benefits as $benefit): ?>
                            <div class="flex items-start">
                                <div class="flex-shrink-0 mt-1">
                                    <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <i data-lucide="<?php echo $benefit['icon']; ?>" class="h-4 w-4"></i>
                                    </div>
                                </div>
                                <div class="ml-4">
                                    <h4 class="text-lg font-bold text-slate-900 mb-1">
                                        <?php echo $benefit['title']; ?>
                                    </h4>
                                    <p class="text-slate-500 text-sm">
                                        <?php echo $benefit['desc']; ?>
                                    </p>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="relative bg-gradient-to-br from-[#0c46e6] to-[#062479] p-12 lg:p-16 flex items-center justify-center text-white overflow-hidden">
                    <div class="relative z-10 text-center">
                        <div class="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 inline-block">
                            <i data-lucide="smartphone" class="h-16 w-16 text-white mx-auto"></i>
                        </div>
                        <h4 class="text-2xl font-bold mb-4">Portal da Família</h4>
                        <p class="text-blue-100 mb-8">
                            Seus clientes acessam boletos e Pix diretamente pelo app, sem burocracia.
                        </p>
                         <!-- Mockup simple representation -->
                        <div class="bg-white text-slate-900 rounded-xl p-4 max-w-xs mx-auto shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div class="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                                <span class="font-bold text-sm">Fatura #12345</span>
                                <span class="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">Paga</span>
                            </div>
                            <div class="space-y-2">
                                <div class="h-2 bg-slate-100 rounded w-3/4"></div>
                                <div class="h-2 bg-slate-100 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Decorative Circles -->
                    <div class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-5 rounded-full blur-2xl"></div>
                    <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl"></div>
                </div>
            </div>
        </div>

    </div>
</section>
