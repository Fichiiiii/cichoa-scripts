import { world, Vector } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(eventData => {

    const player = eventData.sender

    if (eventData.message.startsWith('.home')) {

        eventData.cancel = true

        const spawnPoint = player.getSpawnPoint()

        if(!spawnPoint) return player.runCommandAsync(`execute in overworld run tp @s 0 88 0`)
        
        const spawnDimension = spawnPoint.dimension.id.split(':')[1]
        const spawnPosition = new Vector(spawnPoint.x, spawnPoint.y, spawnPoint.z)
        
        player.runCommandAsync(`execute in ${spawnDimension} run tp @s ${spawnPosition.x} ${spawnPosition.y} ${spawnPosition.z}`)

    }
})
