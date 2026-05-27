export const projects = [

{
    id: "3Dfile",
    title: "Game Rules",
    type: "model",
    model: "/models/Cards.glb",
    // image: "/images/solder.jpg",        // still used as thumbnail in the 3D scene
    content: [
        { type: "text", html: "There are four categories of cards:" },
        { type: "image", src: "/images/img1.png", alt: "colors" },
        { type: "text", html: "And four symbols for the cards:" },
        { type: "image", src: "/images/img2.png", alt: "symbols" },
        { type: "text", html: "Every player is handed 5 cards randomly. One card is set down from the deck to set up the color and the symbol, and the game begins." },
        { type: "text", html: "Players must place a card from their deck that matches either the symbol or the color of the last card that was placed in the pile. Whichever card is placed down must be answered by the player. Others can answer or talk about it if they wish to. The goal is for the group to get to know each other and talk, almost forgetting that the game is there." },
        { type: "text", html: "If a player doesn’t want to answer a card that they can place down, they must place it down and draw another card. This can only be done every other match, so not twice in a row." }
    ]
}

]