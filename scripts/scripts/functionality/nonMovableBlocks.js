import { world } from '@minecraft/server'

world.beforeEvents.pistonActivate.subscribe(eventData => {
    const blocks = eventData.piston.getAttachedBlocks()

    blocks.forEach(block => {
        if (eventData.dimension.getBlock(block).hasTag("nonMovable")) eventData.cancel = true
    })
})