document.addEventListener('DOMContentLoaded', () => {
    // Tạo hình trái tim từ các bông hoa
    const heartContainer = document.querySelector('.flower-heart');
    
    function createHeartPoints() {
        const points = [];
        const size = 12;
        const density = 5;
        
        for (let angle = 0; angle < 360; angle += density) {
            const radians = (angle * Math.PI) / 180;
            const x = 16 * Math.pow(Math.sin(radians), 3);
            const y = -(13 * Math.cos(radians) - 5 * Math.cos(2 * radians) - 2 * Math.cos(3 * radians) - Math.cos(4 * radians));
            
            points.push({
                x: x * size + 200,
                y: y * size + 200
            });
        }
        return points;
    }

    // Tạo các bông hoa
    const heartPoints = createHeartPoints();
    heartPoints.forEach((point, index) => {
        const flower = document.createElement('div');
        flower.className = 'flower-point';
        flower.style.left = `${point.x}px`;
        flower.style.top = `${point.y}px`;
        flower.style.transform = `rotate(${Math.random() * 360}deg)`;
        flower.style.animationDelay = `${index * 0.02}s`;
        heartContainer.appendChild(flower);
    });

    // Đếm ngược 24 giờ
    let totalSeconds = 24 * 60 * 60; // 24 giờ

    function updateTimer() {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        if (totalSeconds > 0) {
            totalSeconds--;
        }
    }

    // Cập nhật timer mỗi giây
    setInterval(updateTimer, 1000);
    updateTimer();

    // Thêm hiệu ứng hover cho các icon
    const icons = document.querySelectorAll('.icon');
    icons.forEach(icon => {
        icon.addEventListener('mouseover', () => {
            icon.style.transform = 'scale(1.2)';
        });
        icon.addEventListener('mouseout', () => {
            icon.style.transform = 'scale(1)';
        });
    });
});

// Chatbot functionality
let chatCount = 0;
const MAX_CHAT_COUNT = 5;
const SLEEP_MESSAGE = "Cậu thông cảm mình chỉ làm tới đây thôi. Tớ buồn ngủ quá :)";

const responses = {
    'xin lỗi': 'Anh thực sự rất có lỗi với em. Anh hứa sẽ không để em phải đợi lâu như vậy nữa.',
    'không sao': 'Cảm ơn em đã thông cảm. Anh thực sự rất trân trọng điều đó.',
    'được': 'Cảm ơn em nhiều lắm. Anh sẽ cố gắng làm tốt hơn.',
    'giận': 'Anh biết em giận là đúng. Anh sẽ cố gắng không để em phải buồn nữa.',
    'nhớ': 'Anh cũng rất nhớ em. Xin lỗi vì đã không trả lời tin nhắn của em.',
    'Ngủ': 'Giờ tớ mới ngủ',
    'wow': 'hehe',
    'Thích': ':)',
    'hello': 'Hello cậu',
    'default': 'Cậu nói gì đi, tớ đang lắng nghe đây.',
    'Quyết': 'Tớ nghe đây cậu cứ nói đi',
    'chào': 'Chào cậu!',
    'hi': 'Hi cậu!',
    'hey': 'Hey cậu!',
    'ok': 'Ok cậu!',
    'ừ': 'Ừ cậu!',
    'ừm': 'Ừm cậu!',
    'haha': 'Haha vui quá!',
    'hehe': 'Hehe dễ thương!',
    'hihi': 'Hihi cười tươi!',
    'yêu': 'Tớ cũng yêu cậu!',
    'thương': 'Tớ cũng thương cậu!',
    'ghét': 'Sao cậu lại ghét tớ?',
    'buồn': 'Đừng buồn nữa cậu ơi!',
    'vui': 'Vui quá cậu nhỉ!',
    'đi': 'Đi đâu cậu?',
    'về': 'Về nhà cẩn thận nha!',
    'ăn': 'Ăn gì ngon không?',
    'ngủ': 'Ngủ ngon nha!',
    'học': 'Học tốt nha!',
    'làm': 'Làm gì vậy cậu?',
    'chơi': 'Chơi gì vui không?',
    'điện thoại': 'Điện thoại hết pin à?',
    'máy tính': 'Máy tính bị sao vậy?',
    'internet': 'Mạng chậm quá phải không?',
    'facebook': 'Lướt facebook vui không?',
    'instagram': 'Xem instagram nhiều không?',
    'tiktok': 'Xem tiktok vui không?',
    'youtube': 'Xem youtube gì vậy?',
    'netflix': 'Xem phim gì hay không?',
    'game': 'Chơi game gì vui không?',
    'đẹp': 'Cậu đẹp quá!',
    'xinh': 'Cậu xinh quá!',
    'dễ thương': 'Cậu dễ thương quá!',
    'đáng yêu': 'Cậu đáng yêu quá!',
    'ngốc': 'Cậu ngốc quá!',
    'ngu': 'Đừng nói vậy cậu!',
    'điên': 'Cậu điên quá!',
    'khùng': 'Cậu khùng quá!',
};

function toggleChat() {
    const chatBox = document.getElementById('chatBox');
    chatBox.classList.toggle('active');
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message) {
        chatCount++;
        
        if (chatCount > MAX_CHAT_COUNT) {
            addMessage(SLEEP_MESSAGE, 'received');
            input.value = '';
            return;
        }
        
        addMessage(message, 'sent');
        
        // Get response after a short delay
        setTimeout(() => {
            const response = getResponse(message.toLowerCase());
            addMessage(response, 'received');
        }, 1000);
        
        input.value = '';
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function addMessage(text, type) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function getResponse(message) {
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key.toLowerCase())) {
            return response;
        }
    }
    return responses.default;
}
