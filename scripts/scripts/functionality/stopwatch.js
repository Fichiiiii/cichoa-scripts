import { system, world } from '@minecraft/server';

world.beforeEvents.itemUseOn.subscribe(eventData => {

    let block = eventData.block
    let item = eventData.itemStack

    let copperBlocks = ['minecraft:copper_block', 'minecraft:exposed_copper', 'minecraft:weathered_copper', 'minecraft:oxidized_copper']
    let cutCopperBlocks = ['minecraft:cut_copper', 'minecraft:exposed_cut_copper', 'minecraft:weathered_cut_copper', 'minecraft:oxidized_cut_copper']

    if (item.typeId == 'cs:stopwatch') {

        eventData.cancel = true

        if (copperBlocks.includes(block.typeId)) {

            let index = copperBlocks.indexOf(block.typeId)
            if (index < 3) index += 1

            system.run(() => {
                block.setType(copperBlocks[index])
            })
        }

        if (cutCopperBlocks.includes(block.typeId)) {

            let index = cutCopperBlocks.indexOf(block.typeId)
            if (index < 3) index += 1

            system.run(() => {
                block.setType(MinecraftBlockTypes.get(cutCopperBlocks[index]))
            })
        }
    }
})