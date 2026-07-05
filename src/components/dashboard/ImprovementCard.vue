<script setup lang="ts">
import Icon from '@/components/Icon.vue'
import type { ImprovementOption } from '@/data/qlEngine'
import { useLocaleStore } from '@/stores/locale'

const props = defineProps<{
  option: ImprovementOption
  resolved: boolean
  focusDepartment?: string
}>()
const emit = defineEmits<{ action: [option: ImprovementOption]; resolve: [] }>()

const locale = useLocaleStore()
const icons: Record<number, string> = { 1: 'scissors', 2: 'chat', 3: 'rocket' }
void props
</script>

<template>
  <div
    class="relative rounded-xl border p-5 flex flex-col"
    :class="option.mostEffective ? 'border-ojen-gold' : 'border-ojen-border'"
  >
    <span
      v-if="option.mostEffective"
      class="absolute -top-3 end-4 rounded bg-ojen-gold text-ojen-bg text-[10px] font-bold px-2 py-1"
    >
      {{ locale.t('improvement.mostEffective') }}
    </span>

    <p class="text-xs text-ojen-muted tracking-widest mb-1">{{ locale.t('improvement.option', { n: option.id }) }}</p>
    <p v-if="option.id === 1 && focusDepartment" class="text-xs text-ojen-gold font-semibold mb-2">
      {{ focusDepartment }}
    </p>

    <div class="flex items-center gap-2 mb-3">
      <span class="w-8 h-8 rounded-lg bg-ojen-panel-light flex items-center justify-center">
        <Icon :name="icons[option.id]" class="w-4 h-4 text-ojen-gold" />
      </span>
      <h3 class="font-semibold">{{ locale.t(option.titleKey) }}</h3>
    </div>

    <p class="text-sm text-ojen-muted mb-3">{{ locale.t(option.descriptionKey) }}</p>
    <ul class="text-xs text-ojen-muted space-y-1 mb-4">
      <li v-for="d in option.detailKeys" :key="d">{{ locale.t(d) }}</li>
    </ul>

    <div v-if="option.impactTagKeys.length" class="mb-2">
      <p class="text-[11px] text-ojen-muted tracking-widest mb-2">{{ locale.t('improvement.expectedImpact') }}</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tagKey in option.impactTagKeys"
          :key="tagKey"
          class="rounded px-2 py-1 text-[11px] font-medium"
          :class="
            locale.t(tagKey).startsWith('-') ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'
          "
        >
          {{ locale.t(tagKey) }}
        </span>
      </div>
    </div>

    <div v-if="option.reasonTags.length" class="mb-2 space-y-2">
      <p class="text-[11px] text-ojen-muted tracking-widest mb-1">{{ locale.t('improvement.reason') }}</p>
      <span
        v-for="tag in option.reasonTags"
        :key="tag"
        class="block rounded px-2 py-1 text-[11px] font-medium bg-amber-500/15 text-amber-400 w-fit"
      >
        {{ tag }}
      </span>
    </div>

    <div class="mt-auto pt-4 space-y-2">
      <button
        v-if="option.id === 1"
        class="w-full rounded-md border border-ojen-border py-2.5 text-sm font-medium transition"
        :class="
          resolved
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
            : 'hover:border-ojen-gold hover:text-ojen-gold'
        "
        @click="emit('resolve')"
      >
        {{ resolved ? locale.t('improvement.markedAsResolved') : locale.t('improvement.markAsResolved') }}
      </button>
      <button
        class="w-full rounded-md py-2.5 text-sm font-semibold transition"
        :class="
          option.mostEffective
            ? 'bg-ojen-gold text-ojen-bg hover:bg-ojen-gold-light'
            : 'border border-ojen-border hover:border-ojen-gold hover:text-ojen-gold'
        "
        @click="emit('action', option)"
      >
        {{ locale.t(option.ctaKey) }}
      </button>
    </div>
  </div>
</template>
