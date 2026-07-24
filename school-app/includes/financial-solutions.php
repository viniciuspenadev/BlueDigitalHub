<!-- Pillar 2: Financial (Detail Split) -->
<div class="grid lg:grid-cols-2 gap-16 items-center mb-32">
    <!-- Interactive Visual (Grid of Features) -->
    <div class="order-1 relative group">
        <div
            class="absolute inset-0 bg-gradient-to-bl from-green-50 to-emerald-50 rounded-[3rem] transform -rotate-2 scale-105 opacity-60">
        </div>

        <!-- 2x2 Feature Grid -->
        <div class="relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl">
            <div class="grid grid-cols-2 gap-4">
                <!-- Card 1: Gateway -->
                <div
                    class="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-green-200 transition-colors">
                    <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-2">
                        <i data-lucide="credit-card" class="w-5 h-5"></i>
                    </div>
                    <h5 class="font-bold text-slate-800 text-sm mb-1">
                        <?php echo $pt['fin_feat_1']; ?>
                    </h5>
                    <p class="text-[10px] text-slate-500 leading-tight">
                        <?php echo $pt['fin_feat_1_desc']; ?>
                    </p>
                </div>
                <!-- Card 2: Régua -->
                <div
                    class="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                    <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                        <i data-lucide="bell" class="w-5 h-5"></i>
                    </div>
                    <h5 class="font-bold text-slate-800 text-sm mb-1">
                        <?php echo $pt['fin_feat_2']; ?>
                    </h5>
                    <p class="text-[10px] text-slate-500 leading-tight">
                        <?php echo $pt['fin_feat_2_desc']; ?>
                    </p>
                </div>
                <!-- Card 3: App View -->
                <div
                    class="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-purple-200 transition-colors">
                    <div
                        class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-2">
                        <i data-lucide="smartphone" class="w-5 h-5"></i>
                    </div>
                    <h5 class="font-bold text-slate-800 text-sm mb-1">
                        <?php echo $pt['fin_feat_3']; ?>
                    </h5>
                    <p class="text-[10px] text-slate-500 leading-tight">
                        <?php echo $pt['fin_feat_3_desc']; ?>
                    </p>
                </div>
                <!-- Card 4: Dashboard -->
                <div
                    class="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-orange-200 transition-colors">
                    <div
                        class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-2">
                        <i data-lucide="pie-chart" class="w-5 h-5"></i>
                    </div>
                    <h5 class="font-bold text-slate-800 text-sm mb-1">
                        <?php echo $pt['fin_feat_4']; ?>
                    </h5>
                    <p class="text-[10px] text-slate-500 leading-tight">
                        <?php echo $pt['fin_feat_4_desc']; ?>
                    </p>
                </div>
            </div>

            <!-- Integrated Badge overlay -->
            <div
                class="absolute -top-4 -right-4 bg-[#0c46e6] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform rotate-3">
                Asaas Integration
            </div>
        </div>
    </div>

    <!-- Text Content -->
    <div class="order-2">
        <div class="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
            <i data-lucide="wallet" class="w-6 h-6"></i>
        </div>
        <h3 class="text-3xl font-bold text-slate-900 mb-4">
            <?php echo $pt['fin_title']; ?>
        </h3>
        <p class="text-slate-600 text-lg leading-relaxed mb-6">
            <?php echo $pt['fin_subtitle']; ?>
        </p>
        <ul class="space-y-4 mb-8">
            <li
                class="flex items-center gap-3 text-slate-700 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span
                    class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                    <i data-lucide="check" class="w-3 h-3"></i>
                </span>
                <?php echo $pt['fin_ben_1']; ?>
            </li>
            <li
                class="flex items-center gap-3 text-slate-700 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span
                    class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <i data-lucide="clock" class="w-3 h-3"></i>
                </span>
                <?php echo $pt['fin_ben_2']; ?>
            </li>
            <li
                class="flex items-center gap-3 text-slate-700 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span
                    class="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                    <i data-lucide="briefcase" class="w-3 h-3"></i>
                </span>
                <?php echo $pt['fin_ben_3']; ?>
            </li>
        </ul>
    </div>
</div>