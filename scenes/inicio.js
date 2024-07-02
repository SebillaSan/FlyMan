export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "mainMenu" });
    }

    create() {
        // Mostrar título del juego
        const titleText = this.add.text(this.cameras.main.width / 2, 100, 'Flyman', {
            fontFamily: 'Arial',
            fontSize: 48,
            color: '#87CEEB',  // Color celeste nube
            stroke: '#000',
            strokeThickness: 6,
        }).setOrigin(0.5);
    
        // Mostrar texto de inicio de juego
        const startText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 'Iniciar Juego', {
            fontFamily: 'Arial',
            fontSize: 32,
            color: '#ffffff'
        }).setOrigin(0.5);
    
        // Texto "Press Enter" con titilación
        const pressEnterText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 120, 'Press Enter', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff'
        }).setOrigin(0.5);
    
        // Animación de titilación para el texto "Press Enter"
        this.tweens.add({
            targets: pressEnterText,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });
    
        // Habilitar la detección de teclas
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('game'); // Iniciar la escena principal del juego al presionar Enter
        });
    }
}