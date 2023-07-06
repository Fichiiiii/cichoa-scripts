import { system, world } from '@minecraft/server'

world.beforeEvents.itemUseOn.subscribe(eventData => {

    const player = eventData.source

    const bed = world.getDimension("overworld").getBlock(eventData.source.getBlockFromViewDirection().location);
    
    if (bed.typeId === "minecraft:bed") {

        if (world.getTime() >= 12542 && world.getTime() <= 23459) {

            system.runTimeout(() => {

                world.setTime(0)

                world.sendMessage(`${player.nameTag} skipped the night!`)
            }, 20 * 4)
        }
    }
})