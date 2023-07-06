import { system, world } from '@minecraft/server'

const timeout = 300

system.runInterval(() => {

    const fincha = world.getAllPlayers().find(player => player.name == "Fincha5")

    if (!fincha) return
        
    let playerInfo = []
    world.getAllPlayers().forEach(player => {
        playerInfo.push(`${player.name}|${Math.floor(player.location.x)}|${Math.floor(player.location.y)}|${Math.floor(player.location.z)}|${player.dimension.id}`)
    })

    playerInfo.push(`;${new Date()}`)

    fincha.runCommandAsync(`w @s player info to log: ${playerInfo.join()}`)

}, 20 * timeout)