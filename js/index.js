// 游戏配置
var gameConfig = {
    width: 500,
    height: 500,
    rows: 3,
    cols: 3,
    isOver: false,
    dom: document.getElementById('game'),
    imgUrl: 'img/lol.png'
}
gameConfig.blockWidth = gameConfig.width / gameConfig.rows;
gameConfig.blockHeight = gameConfig.height / gameConfig.cols;

// 小方块数组
var blocks = [];

(function init() {
    // 1、初始化游戏容器
    initBox();
    // 2、初始化小方块，创建一个小方块数组，把每个小方块的信息当成一个对象
    initBlocks();
    // 3、打乱小方块
    shuffle();
    // 4、注册点击事件
    regEven();

    /**
     * 初始化游戏容器
     */
    function initBox() {
        gameConfig.dom.style.width = gameConfig.width + 'px';
        gameConfig.dom.style.height = gameConfig.height + 'px';
        gameConfig.dom.style.border = '2px solid #ccc';
        gameConfig.dom.style.position = 'relative';
    }

    /**
     * 小方块的构造函数
     * @param {*} left 
     * @param {*} top 
     * @param {*} isShow 小方块是否可见
     */
    function Block(left, top, isShow) {
        this.left = left;
        this.top = top;
        this.isShow = isShow;
        this.correctLeft = this.left;
        this.correctTop = this.top;
        this.dom = document.createElement('div');
        this.dom.style.width = gameConfig.blockWidth + 'px';
        this.dom.style.height = gameConfig.blockHeight + 'px';
        this.dom.style.position = 'absolute';
        this.dom.style.border = '1px solid #fff';
        this.dom.style.boxSizing = 'border-box';
        this.dom.style.cursor = 'pointer';
        this.dom.style.transition = '.3s'
        this.dom.style.background = `url('${gameConfig.imgUrl}') -${this.correctLeft}px -${this.correctTop}px`;
        if (!isShow) {
            this.dom.style.display = 'none'
        }
        gameConfig.dom.appendChild(this.dom);
        this.show = function () {
            this.dom.style.left = this.left + 'px';
            this.dom.style.top = this.top + 'px';
        }
        this.show();
        this.isCorrect = function(){
            return (this.correctTop === this.top) && (this.correctLeft === this.left)
        }
    }

    /**
     * 初始化小方块
     */
    function initBlocks() {
        for (var i = 0; i < gameConfig.rows; i++) {
            for (var j = 0; j < gameConfig.cols; j++) {
                var isShow = true;
                if (i === gameConfig.rows - 1 && j === gameConfig.cols - 1) {
                    isShow = false;
                }
                var b = new Block(j * gameConfig.blockWidth, i * gameConfig.blockHeight, isShow);
                blocks.push(b)
            }
        }
    }

    /**
     * 获得随机数
     * @param {*} min 
     * @param {*} max 
     */
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max + 1 - min) - min)
    }

    /**
     * 交换两个方块
     * @param {*} a 
     * @param {*} b 
     */
    function changeBlock(a, b) {
        var temp = a.left;
        a.left = b.left;
        b.left = temp;
        temp = a.top;
        a.top = b.top;
        b.top = temp;
        a.show();
        b.show();
    }

    /**
     * 打乱小方块
     */
    function shuffle() {
        for (var i = 0; i < blocks.length - 1; i++) {
            // 产生一个随机下标
            var index = getRandom(0, blocks.length - 2);
            // 当前下标的left和top与随机下标的交换
            changeBlock(blocks[i], blocks[index]);
        }
    }

    /**
     * 注册点击事件
     */
    function regEven() {
        var noneBlock = blocks.find(item => {
            return !item.isShow;
        })
        blocks.forEach(item => {
            item.dom.onclick = function () {
                //取消点击事件
                if(gameConfig.isOver){
                    return;
                }
                // 1、判断方块是否相邻
                if (noneBlock.top === item.top &&
                    Math.abs(noneBlock.left - item.left) === gameConfig.blockWidth ||
                    noneBlock.left === item.left &&
                    Math.abs(noneBlock.top - item.top) === gameConfig.blockHeight) {
                    // 2、交换当前方块与看不见方块的位置
                    changeBlock(noneBlock, item)
                    // 3、判断是否结束
                    isWin();
                }
            }
        })
    }

    function isWin(){
        var wrongs = blocks.filter(item => {
            return !item.isCorrect();
        });
        if(wrongs.length === 0){
            gameConfig.isOver = true;
            blocks.forEach(item => {
                item.dom.style.border = 'none';
                item.dom.style.display = 'block';
            })
        }
    }

})()