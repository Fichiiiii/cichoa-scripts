import { system, world } from '@minecraft/server'

world.beforeEvents.itemUseOn.subscribe(eventData => {

    const player = eventData.source
    const block = eventData.block

    const bed = world.getDimension("overworld").getBlock(block.location);
    
    if (bed.typeId === "minecraft:bed") {

        if (world.getTimeOfDay() >= 12542 && world.getTimeOfDay() <= 23459) {

            system.runTimeout(() => {

                world.setTimeOfDay(0)

                world.sendMessage(`${player.nameTag} skipped the night!`)
            }, 20 * 4)
        }
    }
})
