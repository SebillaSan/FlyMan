export default class Game extends Phaser.Scene {

    constructor() {
        super({key: "game"});
        this.puntuacion = 0; // Variable para almacenar la puntuación
    }

    init() {}

    preload() {
        // Cargar imágenes y sprites
        this.load.image("background", "images/Background.png");
        this.load.spritesheet("personaje", "images/XL/Correr/correr.png", { frameWidth: 768 / 3, frameHeight: 768 / 3, startFrame: 1 });
        this.load.spritesheet("saltar", "images/XL/Saltar/salto.png", { frameWidth: 512 / Math.sqrt(4), frameHeight: 512 / Math.sqrt(4) });
        this.load.image("palo", "images/elementos/palo.png");
        this.load.image("piso", "images/elementos/plataforma.png");
        this.load.image("pisito", "images/elementos/pisito.png");
        this.load.image("espinas", "images/elementos/espinas.png");
    }

    create() {
        // Crear fondo
        this.backgrounds = [];
        const bgWidth = this.textures.get("background").getSourceImage().width;
        for (let i = 0; i <= this.cameras.main.width / bgWidth; i++) {
            this.createBackground(i * bgWidth);
        }

        // Configurar el mundo y la cámara
        this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, this.game.config.height);
        this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, this.game.config.height);

        // Crear plataformas y personaje
        this.plataformas = this.physics.add.staticGroup();
        this.crearPisoInicial();

        this.player = this.physics.add.sprite(100, 300, "personaje").setScale(0.4).setCollideWorldBounds(true).setSize(100, 150).setOffset(80, 90);
        this.cameras.main.startFollow(this.player);

        // Crear animaciones
        this.anims.create({ key: "correr", frames: this.anims.generateFrameNumbers("personaje", { start: 1, end: 8 }), frameRate: 9, repeat: -1 });
        this.anims.create({ key: "salto", frames: this.anims.generateFrameNumbers("saltar", { start: 0, end: 3 }), frameRate: 10, repeat: -1 });

        // Configurar colisiones
        this.physics.world.gravity.y = 650;
        this.physics.add.collider(this.player, this.plataformas);

        this.cursor = this.input.keyboard.createCursorKeys();

        // Variables para generación de plataformas y obstáculos
        this.ultimoX = 800;
        this.distanciaGenerar = 500; // Reducir la distancia entre generaciones

        this.obstaculos = this.physics.add.group({ immovable: true, allowGravity: false });
        this.physics.add.collider(this.player, this.obstaculos, this.hitObstaculo, null, this);

        // Texto de puntuación
        this.textoPuntuacion = this.add.text(20, 20, 'Puntuación: 0', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff'
        }).setScrollFactor(0);
    }

    update() {
        const bgWidth = this.textures.get("background").getSourceImage().width;
        if (this.player.x > this.backgrounds[this.backgrounds.length - 1].x - bgWidth) {
            this.createBackground(this.backgrounds[this.backgrounds.length - 1].x + bgWidth);
        }

        if (this.player.x > this.ultimoX - this.distanciaGenerar) {
            this.crearPlataformas();
            this.crearObstaculos();
        }

        this.moverJugador();

        // Verificar si el jugador ha pasado por los espacios entre los obstáculos
        this.obstaculos.getChildren().forEach(obstaculo => {
            if (obstaculo.x < this.player.x && !obstaculo.pasado) {
                // Marcar el obstáculo como pasado
                obstaculo.pasado = true;

                // Incrementar la puntuación
                this.incrementarPuntuacion();
            }
        });
    }

    incrementarPuntuacion() {
        this.puntuacion++;
        this.textoPuntuacion.setText(`Puntuación: ${this.puntuacion}`);
    }

    crearPisoInicial() {
        for (let i = 0; i < 9; i++) {
            const tipoPlataforma = i % 2 === 0 ? "piso" : "pisito";
            this.plataformas.create(80 + (i * 120), 550, tipoPlataforma).setScale(0.2).refreshBody();
        }
    }

    crearPlataformas() {
        for (let i = 0; i < 9; i++) {
            const xPos = this.ultimoX + (i * 120);
            const tipoPlataforma = i % 2 === 0 ? "piso" : "pisito";
            this.plataformas.create(xPos, 550, tipoPlataforma).setScale(0.2).refreshBody();
        }
        this.ultimoX += 1080;
    }

    crearObstaculos() {
        const obstaculoX = this.ultimoX + Phaser.Math.Between(400, 700);
        const offsetY = Phaser.Math.Between(-100, 50); // Ajusta la posición vertical aleatoriamente

        if (this.primerPatron) {
            // Primer patrón de obstáculos (más alto)
            for (let i = 0; i < 3; i++) {
                const obstaculoY1 = 400 - i * 250 + offsetY; // Ajusta la posición en Y con offset aleatorio
                const pared1 = this.obstaculos.create(obstaculoX, obstaculoY1, "palo").setScale(0.3).refreshBody();
                pared1.pasado = false; // Marcar el obstáculo como no pasado
            }
        } else {
            // Segundo patrón de obstáculos (más bajo)
            for (let i = 0; i < 3; i++) {
                const obstaculoY2 = 450 + offsetY - i * 250; // Ajusta la posición en Y con offset aleatorio
                const pared2 = this.obstaculos.create(obstaculoX, obstaculoY2, "palo").setScale(0.3).refreshBody();
                pared2.pasado = false; // Marcar el obstáculo como no pasado
            }
        }

        // Alternar para el próximo patrón
        this.primerPatron = !this.primerPatron;
    }

    hitObstaculo() {
        console.log("Golpeaste un obstáculo!");
        this.scene.launch('gameOver', { puntuacion: this.puntuacion });
        this.scene.pause();
        this.reiniciarPuntuacion();
    }

    reiniciarPuntuacion() {
        this.puntuacion = 0;
        this.textoPuntuacion.setText(`Puntuación: ${this.puntuacion}`);
    }

    createBackground(x) {
        const bg = this.add.image(x, 0, "background").setOrigin(0, 0);
        this.backgrounds.push(bg);
        this.children.sendToBack(bg);
    }

    moverJugador() {
        const SALTO_BASE_VELOCIDAD = -100; // Velocidad base del salto
        const SALTO_EXTRA_VELOCIDAD = -170; // Velocidad adicional al mantener presionada UP
    
        // Movimiento horizontal del jugador
        if (this.cursor.right.isDown) {
            this.player.setVelocityX(400).anims.play("correr", true).flipX = false;
        } else if (this.cursor.left.isDown) {
            this.player.setVelocityX(-400).anims.play("correr", true).flipX = true;
        } else {
            this.player.setVelocityX(0).anims.stop().setFrame(0);
        }
    
        // Control del salto
        if (this.cursor.up.isDown) {
            if (this.player.body.touching.down) {
                // Aplicar un salto normal al presionar UP
                this.player.setVelocityY(SALTO_BASE_VELOCIDAD).anims.play("salto", true);
            } else {
                // Aplicar un salto más alto al mantener UP presionado en el aire
                this.player.setVelocityY(SALTO_BASE_VELOCIDAD + SALTO_EXTRA_VELOCIDAD).anims.play("salto", true);
            }
        } else if (this.player.body.velocity.y < 0 && !this.player.body.touching.down) {
            // Mantener la animación de salto si el jugador está en el aire
            this.player.anims.play("salto", true);
        }
    }
}