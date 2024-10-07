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

function resetSelection() {
    selectedPieces = [];
    remainingPieces = [...chessPieces];
    updateSelectionArea();
    document.querySelectorAll('.chess-piece').forEach(element => {
        element.style.visibility = 'visible';
    });
}

function undoLastSelection() {
    if (selectedPieces.length > 0) {
        const lastPiece = selectedPieces.pop();
        const index = chessPieces.findIndex(p => p.name === lastPiece.name && p.color === lastPiece.color);
        remainingPieces[index] = chessPieces[index];
        document.querySelector(`.chess-piece[data-index="${index}"]`).style.visibility = 'visible';
        updateSelectionArea();
    }
}

function saveAsImage() {
    console.log('开始保存高分辨率图片');
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 设置canvas背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 计算缩放比例
    const scale = 1024 / 150; // 原始大小是150px

    // 绘制选择区域的边框
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2 * scale;
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 50 * scale, 0);
        ctx.lineTo(i * 50 * scale, 1024);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * 50 * scale);
        ctx.lineTo(1024, i * 50 * scale);
        ctx.stroke();
    }

    // 绘制棋子
    const slots = [1, 2, 3, 4, 5];
    slots.forEach((slot, index) => {
        const slotElement = document.getElementById(`slot-${slot}`);
        if (slotElement && slotElement.textContent) {
            ctx.font = `${48 * scale}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = slotElement.classList.contains('red-piece') ? 'red' : 'black';
            let x, y;
            switch(index) {
                case 0: x = 75 * scale; y = 75 * scale; break;  // 中
                case 1: x = 25 * scale; y = 75 * scale; break;  // 左
                case 2: x = 125 * scale; y = 75 * scale; break; // 右
                case 3: x = 75 * scale; y = 25 * scale; break;  // 上
                case 4: x = 75 * scale; y = 125 * scale; break; // 下
            }
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

document.addEventListener('DOMContentLoaded', function() {
    initializeChessBoard();
    
    document.getElementById('resetBtn').onclick = resetSelection;
    document.getElementById('undoBtn').onclick = undoLastSelection;
    
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.onclick = function() {
            console.log('保存按钮被点击');
            saveAsImage();
        };
    } else {
        console.error('未找到保存按钮');
    }
    
    document.addEventListener('keydown', (event) => {
        const index = keyMapping.indexOf(event.key.toUpperCase());
        if (index !== -1) {
            selectPiece(index);
        }
    });
});
