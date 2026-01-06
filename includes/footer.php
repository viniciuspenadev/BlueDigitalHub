<?php
// includes/footer.php
?>
<footer class="bg-white border-t border-slate-200 pt-20 pb-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div class="col-span-1 md:col-span-2">
                <!-- Exact Navbar Logo -->
                <a href="#" class="flex items-center group mb-6">
                    <i data-lucide="zap"
                        class="h-6 w-6 text-[#0c46e6] mr-2 fill-current group-hover:scale-110 transition-transform"></i>
                    <span class="font-bold text-2xl text-[#0000bf] tracking-tight">BlueDigital<span
                            class="font-light text-[#0c46e6]">Hub</span></span>
                </a>

                <p class="text-slate-500 max-w-sm mb-8 leading-relaxed">
                    <?php echo $t['footer_desc']; ?>
                </p>

                <!-- Social & Contact -->
                <div class="flex flex-col space-y-4">
                    <div class="flex items-center space-x-4">
                        <a href="https://www.instagram.com/bluedigital.hub/" target="_blank"
                            class="text-slate-400 hover:text-[#0c46e6] transition-colors bg-slate-50 p-3 rounded-full hover:bg-blue-50 border border-slate-100 hover:border-blue-200">
                            <i data-lucide="instagram" class="h-5 w-5"></i>
                        </a>
                        <!-- Address Hidden
                        <span class="text-slate-400 text-sm">Av. Faria Lima...</span>
                        -->
                    </div>
                </div>
            </div>

            <div>
                <h4 class="text-[#0000bf] font-bold mb-6 text-lg">
                    <?php echo $t['footer_serv_title']; ?>
                </h4>
                <ul class="space-y-4 text-slate-500">
                    <li><a href="#" class="hover:text-[#0c46e6] transition-colors flex items-center group"><span
                                class="w-1.5 h-1.5 bg-[#0c46e6] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            <?php echo $t['footer_link_mobile']; ?>
                        </a></li>
                    <li><a href="#" class="hover:text-[#0c46e6] transition-colors flex items-center group"><span
                                class="w-1.5 h-1.5 bg-[#0c46e6] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            <?php echo $t['footer_link_web']; ?>
                        </a></li>
                    <li><a href="#" class="hover:text-[#0c46e6] transition-colors flex items-center group"><span
                                class="w-1.5 h-1.5 bg-[#0c46e6] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            <?php echo $t['footer_link_design']; ?>
                        </a></li>
                    <li><a href="#" class="hover:text-[#0c46e6] transition-colors flex items-center group"><span
                                class="w-1.5 h-1.5 bg-[#0c46e6] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            <?php echo $t['footer_link_growth']; ?>
                        </a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-[#0000bf] font-bold mb-6 text-lg">
                    <?php echo $t['footer_company_title']; ?>
                </h4>
                <ul class="space-y-4 text-slate-500">
                    <li><a href="#" class="hover:text-[#0c46e6] transition-colors">
                            <?php echo $t['footer_link_about']; ?>
                        </a></li>
                    <li><a href="#" class="hover:text-[#0c46e6] transition-colors">
                            <?php echo $t['footer_link_careers']; ?>
                        </a></li>
                    <li><a href="#" class="hover:text-[#0c46e6] transition-colors">
                            <?php echo $t['footer_link_blog']; ?>
                        </a></li>
                    <li><a href="#" class="hover:text-[#0c46e6] transition-colors">
                            <?php echo $t['footer_link_privacy']; ?>
                        </a></li>
                </ul>
            </div>
        </div>

        <div
            class="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
            <p>&copy;
                <?php echo date("Y"); ?> BlueDigital Hub. All rights reserved.
            </p>
            <p class="mt-2 md:mt-0 flex items-center">
                <?php echo $t['footer_made_with']; ?>
            </p>
        </div>
    </div>
</footer>