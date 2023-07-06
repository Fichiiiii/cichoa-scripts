import { world, ItemStack, Vector, ItemTypes } from '@minecraft/server';

world.afterEvents.blockBreak.subscribe(eventData => {

    const player = eventData.player

    const blockBefore = eventData.brokenBlockPermutation
    const block = eventData.block

    if (blockBefore.type.id == 'minecraft:reinforced_deepslate') {

        player.dimension.spawnItem(new ItemStack(ItemTypes.get('minecraft:reinforced_deepslate'), 1), block.location)
        
    }
})