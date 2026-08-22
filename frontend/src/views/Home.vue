<template>
  <div class="home">
    <HeroSection />
    <StatsSection />
    <Pricing :isHero="true" />
    <FeaturesSection />
    <ChartsSection />
    <ReviewsSection />
    <CtaSection />
  </div>
</template>

<script setup>
import HeroSection from '@/components/HeroSection.vue'
import StatsSection from '@/components/StatsSection.vue'
import Pricing from '@/views/Pricing.vue'
import FeaturesSection from '@/components/FeaturesSection.vue'
import ChartsSection from '@/components/ChartsSection.vue'
import ReviewsSection from '@/components/ReviewsSection.vue'
import CtaSection from '@/components/CtaSection.vue'
</script>

<style lang="scss" scoped>
.home {
  flex: 1;
}
</style>

