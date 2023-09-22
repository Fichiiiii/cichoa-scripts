import { world } from '@minecraft/server'

world.afterEvents.playerPlaceBlock.subscribe(eventData => {

    const player = eventData.player
    const block = eventData.block

    if (block.hasTag('16d-rotatable')) {

        const rotation = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, -180, -157.5, -135, -112.5, -90, -67.5, -45, -22.5].reduce((a, b) => {
            return Math.abs(b - player.getRotation().y) < Math.abs(a - player.getRotation().y) ? b : a
        });

        let cs_rotation = 1

        switch (rotation) {
            case 0:
                cs_rotation = 1
                break;
            case -22.5:
                cs_rotation = 2
                break;
            case -45:
                cs_rotation = 3
                break;
            case -67.5:
                cs_rotation = 4
                break;
            case -90:
                cs_rotation = 5
                break;
            case -112.5:
                cs_rotation = 6
                break;
            case -135:
                cs_rotation = 7
                break;
            case -157.5:
                cs_rotation = 8
                break;
            case -180:
                cs_rotation = 9
                break;
            case 180:
                cs_rotation = 9
                break;
            case 157.5:
                cs_rotation = 10
                break;
            case 135:
                cs_rotation = 11
                break;
            case 112.5:
                cs_rotation = 12
                break;
            case 90:
                cs_rotation = 13
                break;
            case 67.5:
                cs_rotation = 14
                break;
            case 45:
                cs_rotation = 15
                break;
            case 22.5:
                cs_rotation = 16
                break;
        }

        eventData.player.runCommandAsync(`setblock ${block.location.x} ${block.location.y} ${block.location.z} ${block.type.id} ["cs:rotation":${cs_rotation}]`)

    }
})