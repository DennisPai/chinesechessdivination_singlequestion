// 定义棋子
const chessPieces = [
    {name: '帥', limit: 1, color: 'red'}, {name: '仕', limit: 2, color: 'red'}, 
    {name: '相', limit: 2, color: 'red'}, {name: '俥', limit: 2, color: 'red'}, 
    {name: '傌', limit: 2, color: 'red'}, {name: '炮', limit: 2, color: 'red'}, 
    {name: '兵', limit: 5, color: 'red'},
    {name: '將', limit: 1, color: 'black'}, {name: '士', limit: 2, color: 'black'}, 
    {name: '象', limit: 2, color: 'black'}, {name: '車', limit: 2, color: 'black'}, 
    {name: '馬', limit: 2, color: 'black'}, {name: '包', limit: 2, color: 'black'}, 
    {name: '卒', limit: 5, color: 'black'}
];

const keyMapping = 'QWERTYUASDFGHJ';
let selectedPieces = [];
let remainingPieces = [...chessPieces];

// 初始化棋盘
function initializeChessBoard() {
    const chessBoard = document.getElementById('chessBoard');
    chessPieces.forEach((piece, index) => {
        const pieceElement = document.createElement('div');
        pieceElement.className = `chess-piece ${piece.color}-piece`;
        pieceElement.textContent = piece.name;
        pieceElement.dataset.index = index;
        pieceElement.onclick = () => selectPiece(index);
        chessBoard.appendChild(pieceElement);
    });
}

// 选择棋子
function selectPiece(index) {
    const piece = remainingPieces[index];
    if (piece && piece.limit > 0 && selectedPieces.length < 5) {
        selectedPieces.push(piece);
        updateSelectionArea();
        piece.limit--;
        if (piece.limit === 0) {
            remainingPieces[index] = null;
            document.querySelector(`.chess-piece[data-index="${index}"]`).style.visibility = 'hidden';
        }
    }
}

// 更新选择区域
function updateSelectionArea() {
    const slots = [1, 2, 3, 4, 5]; // 中、左、右、上、下
    slots.forEach((slot, index) => {
        const slotElement = document.getElementById(`slot-${slot}`);
        if (selectedPieces[index]) {
            slotElement.textContent = selectedPieces[index].name;
            slotElement.className = `selection-slot ${selectedPieces[index].color}-piece`;
        } else {
            slotElement.textContent = '';
            slotElement.className = 'selection-slot';
        }
    });
}

// 重置选择
function resetSelection() {
    selectedPieces = [];
    remainingPieces = [...chessPieces];
    updateSelectionArea();
    document.querySelectorAll('.chess-piece').forEach(element => {
        element.style.visibility = 'visible';
    });
}

// 撤销最后一次选择
function undoLastSelection() {
    if (selectedPieces.length > 0) {
        const lastPiece = selectedPieces.pop();
        const index = chessPieces.findIndex(p => p.name === lastPiece.name && p.color === lastPiece.color);
        remainingPieces[index] = chessPieces[index];
        document.querySelector(`.chess-piece[data-index="${index}"]`).style.visibility = 'visible';
        updateSelectionArea();
    }
}

// 保存为高分辨率图片
function saveAsImage() {
    console.log('开始保存高分辨率图片');
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d', { alpha: false });

    // 启用抗锯齿
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 设置canvas背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 定义十字布局
    const layout = [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]
    ];

    const cellSize = canvas.width / 3;
    const borderWidth = 2;

    // 绘制十字型布局
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = borderWidth;
    
    layout.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell) {
                ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        });
    });

    // 绘制棋子
    const slots = [
        {index: 1, x: 1, y: 1}, // 中
        {index: 2, x: 0, y: 1}, // 左
        {index: 3, x: 2, y: 1}, // 右
        {index: 4, x: 1, y: 0}, // 上
        {index: 5, x: 1, y: 2}  // 下
    ];

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${cellSize * 0.6}px Arial, sans-serif`;

    slots.forEach(slot => {
        const slotElement = document.getElementById(`slot-${slot.index}`);
        if (slotElement && slotElement.textContent) {
            ctx.fillStyle = slotElement.classList.contains('red-piece') ? 'red' : 'black';
            const x = (slot.x + 0.5) * cellSize;
            const y = (slot.y + 0.5) * cellSize;
            
            // 绘制一个浅色背景圆形
            ctx.beginPath();
            ctx.arc(x, y, cellSize * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = slotElement.classList.contains('red-piece') ? 'rgba(255, 200, 200, 0.5)' : 'rgba(200, 200, 200, 0.5)';
            ctx.fill();

            // 绘制棋子文字
            ctx.fillStyle = slotElement.classList.contains('red-piece') ? 'red' : 'black';
            ctx.fillText(slotElement.textContent, x, y);
        }
    });

    // 创建下载链接
    try {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = '象棋选择_高分辨率.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('高分辨率图片已成功创建并触发下载');
    } catch (error) {
        console.error('创建或下载高分辨率图片时出错:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeChessBoard();
    
    document.getElementById('resetBtn').onclick = resetSelection;
    document.getElementById('undoBtn').onclick = undoLastSelection;
    
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.onclick = saveAsImage;
    } else {
        console.error('未找到保存按钮');
    }
    
    // 添加键盘事件监听
    document.addEventListener('keydown', (event) => {
        const index = keyMapping.indexOf(event.key.toUpperCase());
        if (index !== -1) {
            selectPiece(index);
        }
    });
});
