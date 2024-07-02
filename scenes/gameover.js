export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: "gameOver" });
    }

    preload() {
        // Cargar imagen de fondo o cualquier otro recurso necesario
        this.load.image("gameOverBackground", "images/GameOver.png");
    }

    create(data) {
        // Mostrar imagen de fondo
        const gameOverImage = this.add.image(0, 0, "gameOverBackground").setOrigin(0);
        
        // Ajustar el tamaño para que cubra toda la pantalla
        gameOverImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Mostrar puntuación final
        const scoreText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.8, `Puntuación: ${data.puntuacion}`, {
            fontFamily: 'Arial',
            fontSize: 32,
            color: '#00ff00'
        }).setOrigin(0.5);

        // Botón para reiniciar el juego
        const restartButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.9, 'Reiniciar', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: {
                x: 10,
                y: 5
            }
        }).setOrigin(0.5).setInteractive();

        // Manejar el evento de clic en el botón de reinicio
        restartButton.on('pointerdown', () => {
            this.scene.start('game'); // Reiniciar la escena principal del juego
        });
    }
}