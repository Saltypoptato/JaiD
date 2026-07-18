let userProfile = {
    username: '', fullName: '', phone: '', id: '', dob: '', 
    gender: '', occupation: '', medAllergies: '', foodAllergies: '', illnesses: ''
};

// UI Management
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
    });
    document.getElementById(viewId).classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const header = document.getElementById('mainHeader');
    if(['landingView', 'loginView', 'signUpView'].includes(viewId)) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
}

// --- CUTE CUSTOM ALERT SYSTEM ---
function showCuteAlert(message, icon = '(ᵕ—ᴗ—)') {
    document.getElementById('cuteAlertMessage').innerText = message;
    document.getElementById('cuteAlertIcon').innerText = icon;
    const overlay = document.getElementById('cuteAlertOverlay');
    const box = document.getElementById('cuteAlertBox');
    
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        box.classList.remove('scale-90');
        box.classList.add('scale-100');
    }, 10);
}

function closeCuteAlert() {
    const overlay = document.getElementById('cuteAlertOverlay');
    const box = document.getElementById('cuteAlertBox');
    
    overlay.classList.add('opacity-0');
    box.classList.remove('scale-100');
    box.classList.add('scale-90');
    
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 300);
}

// --- VALIDATION & REGISTRATION ---
function handleRegister() {
    const inputsToCheck = [
        'regUsername', 'regPassword', 'regFullName', 'regPhone',
        'regID', 'regDOB', 'regGender', 'regOccupation',
        'regMedAllergies', 'regFoodAllergies', 'regIllnesses'
    ];

    for(let id of inputsToCheck) {
        const val = document.getElementById(id).value.trim();
        if(!val) {
            showCuteAlert("โปรดกรอกข้อมูลให้ครบทุกช่อง เพื่อให้เราได้รู้จักคุณดียิ่งขึ้นนะคับ! ⭑.ᐟ", "♡");
            return; 
        }
    }

    userProfile.username = document.getElementById('regUsername').value;
    userProfile.fullName = document.getElementById('regFullName').value;
    userProfile.phone = document.getElementById('regPhone').value;
    userProfile.id = document.getElementById('regID').value;
    userProfile.dob = document.getElementById('regDOB').value;
    userProfile.gender = document.getElementById('regGender').value;
    userProfile.occupation = document.getElementById('regOccupation').value;
    userProfile.medAllergies = document.getElementById('regMedAllergies').value;
    userProfile.foodAllergies = document.getElementById('regFoodAllergies').value;
    userProfile.illnesses = document.getElementById('regIllnesses').value;
    
    syncProfileToInputs();
    switchView('tosView');
}

function simulateLogin() {
    const user = document.getElementById('loginUsername').value.trim();
    const pass = document.getElementById('loginPassword').value.trim();

    if(!user || !pass) {
        showCuteAlert("อุ้ยย! กรอกทั้งชื่อผู้ใช้และรหัสผ่านของคุณหน่อยน้า ☁️", "☁️");
        return;
    }

    activateUserSession();
}

function simulateGoogleLogin() {
    userProfile.username = 'GoogleUser';
    userProfile.fullName = 'Google Account';
    syncProfileToInputs();
    switchView('tosView');
}

function acceptTos() {
    activateUserSession();
}

function activateUserSession() {
    document.getElementById('profileBtn').classList.remove('hidden');
    switchView('dashboardView');
}

// Quick Mood
function selectQuickEmoji(emoji, label) {
    const status = document.getElementById('emojiStatus');
    status.innerText = `Logged: ${emoji} ${label} ✨`;
    status.classList.remove('hidden');
    appendLogToDashboard(`Mood Logged: ${emoji} ${label}`);
}

// AI Vent
// --- AI VENT: STT (Ears) & TTS (Voice) Integration ---

// 1. Text-to-Speech (TTS) Setup
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'th-TH'; // Set language to Thai
        utterance.rate = 1.0;     // Speaking speed
        utterance.pitch = 1.2;    // Slightly higher pitch for a cute/friendly tone
        window.speechSynthesis.speak(utterance);
    }
}

// 2. Speech-to-Text (STT) Setup
let isRecording = false;
let recognition = null;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'th-TH'; // Set language to Thai

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const inputField = document.getElementById('ventInput');
        inputField.value = (inputField.value + " " + transcript).trim();
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        stopSTT();
    };

    recognition.onend = () => {
        stopSTT();
    };
}

function toggleSTT() {
    if (!recognition) {
        showCuteAlert("เบราว์เซอร์ของคุณไม่รองรับการพิมพ์ด้วยเสียงนะคับ (,,>﹏<,,)", "🎙️");
        return;
    }

    if (isRecording) {
        recognition.stop();
    } else {
        recognition.start();
        isRecording = true;
        
        // Visual feedback for recording state
        const micBtn = document.getElementById('micBtn');
        micBtn.classList.replace('bg-sky-400', 'bg-red-400');
        micBtn.classList.replace('hover:bg-sky-500', 'hover:bg-red-500');
        micBtn.classList.replace('border-sky-600', 'border-red-600');
        micBtn.classList.add('animate-pulse');
        document.getElementById('ventInput').placeholder = "ᯓ★ กำลังฟังอยู่คับ...";
    }
}

function stopSTT() {
    isRecording = false;
    const micBtn = document.getElementById('micBtn');
    if(micBtn) {
        // Reset visual feedback
        micBtn.classList.replace('bg-red-400', 'bg-sky-400');
        micBtn.classList.replace('hover:bg-red-500', 'hover:bg-sky-500');
        micBtn.classList.replace('border-red-600', 'border-sky-600');
        micBtn.classList.remove('animate-pulse');
        document.getElementById('ventInput').placeholder = "..ระบายความรู้สึกของคุณ ˚⟡˖";
    }
}

// 3. Updated sendVent Function (Incorporating TTS)
function sendVent() {
    const val = document.getElementById('ventInput').value;
    if(!val.trim()) return;

    const chat = document.getElementById('chatBox');
    const userBubble = document.createElement('div');
    userBubble.className = "bg-amber-400 text-slate-900 p-3 sm:p-5 rounded-[1.5rem] rounded-tr-sm max-w-[85%] ml-auto text-right shadow-md font-black border-[3px] border-amber-500 text-base sm:text-lg";
    userBubble.innerText = val;
    chat.appendChild(userBubble);
    
    document.getElementById('ventInput').value = '';
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
        const aiMessage = "ฉันได้ยินคุณอย่างชัดเจนนะ ขอบคุณที่แบ่งปันสิ่งนี้กับฉัน คุณทำได้ดีมาก เป็นกำลังใจให้นะคับ";
        const spokenMessage = "ฉันได้ยินคุณอย่างชัดเจนนะ ขอบคุณที่แบ่งปันสิ่งนี้กับฉัน คุณทำได้ดีมาก เป็นกำลังใจให้นะคับ";
        
        const aiBubble = document.createElement('div');
        aiBubble.className = "bg-amber-50 text-slate-800 p-3 sm:p-5 rounded-[1.5rem] rounded-tl-sm max-w-[85%] border-[3px] border-amber-300 font-bold text-base sm:text-lg shadow-sm animate-float";
        aiBubble.innerText = aiMessage;
        chat.appendChild(aiBubble);
        chat.scrollTop = chat.scrollHeight;
        
        // Trigger the AI's Voice
        speakText(spokenMessage);
        
        document.getElementById('aiFollowUp').classList.remove('hidden');
        document.getElementById('aiFollowUp').classList.add('flex');
    }, 1000);
}

function aiResponseReaction(reactionText) {
    document.getElementById('aiFollowUp').classList.add('hidden');
    document.getElementById('aiFollowUp').classList.remove('flex');
    const chat = document.getElementById('chatBox');
    const noteBubble = document.createElement('div');
    noteBubble.className = "text-center text-sm sm:text-base text-amber-600 bg-amber-100 p-2 sm:p-3 rounded-xl w-fit mx-auto font-black shadow-inner border-2 border-amber-200 my-2";
    noteBubble.innerText = `Helped? ${reactionText}`;
    chat.appendChild(noteBubble);
    chat.scrollTop = chat.scrollHeight;
    appendLogToDashboard(`Venting Session done. Helped: ${reactionText}`);
}

// Peer Mode Switch
function togglePeerMode(mode) {
    const chatMode = document.getElementById('peerChatMode');
    const callMode = document.getElementById('peerCallMode');
    const tabChat = document.getElementById('peerTabChat');
    const tabCall = document.getElementById('peerTabCall');

    if (mode === 'chat') {
        chatMode.classList.remove('hidden'); chatMode.classList.add('flex');
        callMode.classList.add('hidden'); callMode.classList.remove('flex');
        tabChat.className = "flex-1 px-4 sm:px-6 py-2 rounded-[1rem] text-lg sm:text-xl font-black bg-amber-400 text-white shadow-md transition-all";
        tabCall.className = "flex-1 px-4 sm:px-6 py-2 rounded-[1rem] text-lg sm:text-xl font-black text-amber-700 hover:bg-amber-200 transition-all";
    } else {
        callMode.classList.remove('hidden'); callMode.classList.add('flex');
        chatMode.classList.add('hidden'); chatMode.classList.remove('flex');
        tabCall.className = "flex-1 px-4 sm:px-6 py-2 rounded-[1rem] text-lg sm:text-xl font-black bg-amber-400 text-white shadow-md transition-all";
        tabChat.className = "flex-1 px-4 sm:px-6 py-2 rounded-[1rem] text-lg sm:text-xl font-black text-amber-700 hover:bg-amber-200 transition-all";
    }
}

// Peer Chat
function sendPeerMsg() {
    const val = document.getElementById('peerInput').value;
    if(!val.trim()) return;

    const chat = document.getElementById('peerChatBox');
    const userBubble = document.createElement('div');
    userBubble.className = "bg-amber-400 text-slate-900 p-3 sm:p-5 rounded-[1.5rem] rounded-tr-sm max-w-[85%] ml-auto text-right shadow-md font-black border-[3px] border-amber-500 text-base sm:text-lg";
    userBubble.innerText = val;
    chat.appendChild(userBubble);
    
    document.getElementById('peerInput').value = '';
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
        const peerBubble = document.createElement('div');
        peerBubble.className = "bg-amber-50 text-slate-800 p-3 sm:p-5 rounded-[1.5rem] rounded-tl-sm max-w-[85%] border-[3px] border-amber-300 font-bold text-base sm:text-lg shadow-sm animate-float";
        peerBubble.innerText = "นั่นฟังดูเหมือนสิ่งที่จะต้องใช้แรงมาก คุณอยากสำรวจว่าสิ่งนี้ทำให้คุณรู้สึกอย่างไรตอนนี้ไหม? ฉันอยู่ตรงนี้กับคุณนะ  ✨";
        chat.appendChild(peerBubble);
        chat.scrollTop = chat.scrollHeight;
    }, 1500);
}

// Tracker
function processTrackerResults() {
    const q1Value = document.getElementById('q1').value || 'Empty';
    const q2Value = document.getElementById('q2').value || 'Empty';

    appendLogToDashboard(`Tracker -> Mood: "${q1Value}" | Stress: "${q2Value}"`);
    document.getElementById('q1').value = '';
    document.getElementById('q2').value = '';
    switchView('dashboardView');
}

// Logs
function appendLogToDashboard(message) {
    const container = document.getElementById('historicalSummary');
    const target = document.getElementById('historyTarget');
    container.classList.remove('hidden');

    const item = document.createElement('div');
    item.className = "bg-pink-50 p-3 sm:p-4 rounded-2xl border-[3px] border-pink-200 text-slate-800 font-black text-sm sm:text-lg shadow-sm";
    item.innerText = message;
    target.insertBefore(item, target.firstChild);
}

// Profile Sync
function syncProfileToInputs() {
    document.getElementById('profUsername').value = userProfile.username;
    document.getElementById('profFullName').value = userProfile.fullName;
    document.getElementById('profPhone').value = userProfile.phone;
    document.getElementById('profID').value = userProfile.id;
}

function saveProfile() {
    userProfile.username = document.getElementById('profUsername').value;
    userProfile.fullName = document.getElementById('profFullName').value;
    userProfile.phone = document.getElementById('profPhone').value;
    userProfile.id = document.getElementById('profID').value;
    
    showCuteAlert('โปรไฟล์อัปเดตสำเร็จแล้ว! ✨', '🎉');
    switchView('dashboardView');
}

function logout() {
    document.getElementById('profileBtn').classList.add('hidden');
    document.getElementById('historicalSummary').classList.add('hidden');
    document.getElementById('historyTarget').innerHTML = '';
    switchView('landingView');
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    switchView('landingView');
});

// Initialize Icons
lucide.createIcons();