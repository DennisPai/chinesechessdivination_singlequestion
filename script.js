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
    const slots = [1, 2, 3, 4, 5];
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

// ... (前面的代碼保持不變)

function saveAsImage() {
    console.log('開始保存圖片');
    const canvas = document.getElementById('captureCanvas');
    if (!canvas) {
        console.error('未找到canvas元素');
        return;
    }
    const ctx = canvas.getContext('2d');

    // 保持之前的解析度設置
    const scale = 10;
    const canvasSize = 180; // 調整畫布大小以適應新的間距
    canvas.width = canvasSize * scale;
    canvas.height = canvasSize * scale;
    ctx.scale(scale, scale);

    // 設置canvas背景
    ctx.fillStyle = '#2b4b8c';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // 調整圓形位置以設置更小的間距
    const circleRadius = 30;
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const distance = circleRadius * 2 + 6; // 減少間距

    const positions = [
        {x: centerX, y: centerY},              // 中
        {x: centerX - distance, y: centerY},   // 左
        {x: centerX + distance, y: centerY},   // 右
        {x: centerX, y: centerY - distance},   // 上
        {x: centerX, y: centerY + distance}    // 下
    ];

    // 繪製棋子
    const slots = [1, 2, 3, 4, 5];
    slots.forEach((slot, index) => {
        const slotElement = document.getElementById(`slot-${slot}`);
        if (slotElement && slotElement.textContent) {
            const {x, y} = positions[index];
            const isRed = slotElement.classList.contains('red-piece');
            
            // 繪製圓形背景
            ctx.beginPath();
            ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = isRed ? 'red' : 'black';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 繪製文字
            ctx.font = 'bold 36px "Microsoft YaHei", "微軟正黑體", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = isRed ? 'red' : 'black';
            
            // 確保文字完全置中
            ctx.fillText(slotElement.textContent, x, y);
        }
    });

    // 獲取輸入的文字作為檔名
    const inputText = document.getElementById('textInput').value.trim();
    const fileName = inputText ? `${inputText}.png` : '象棋選擇.png';

    // 創建下載連結
    try {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('圖片已成功創建並觸發下載');
    } catch (error) {
        console.error('創建或下載圖片時出錯:', error);
    }
}

// ... (其餘代碼保持不變)

document.addEventListener('DOMContentLoaded', function() {
    initializeChessBoard();
    
    document.getElementById('resetBtn').onclick = resetSelection;
    document.getElementById('undoBtn').onclick = undoLastSelection;
    
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.onclick = function() {
            console.log('保存按鈕被點擊');
            saveAsImage();
        };
    } else {
        console.error('未找到保存按鈕');
    }
    
    document.addEventListener('keydown', (event) => {
        const index = keyMapping.indexOf(event.key.toUpperCase());
        if (index !== -1) {
            selectPiece(index);
        }
    });
});
