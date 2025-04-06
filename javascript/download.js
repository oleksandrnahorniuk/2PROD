import { db, dbRef, get, child } from "./firebase.js";



// Функция для получения URL файла
export function getAudioURL(trackId) {
    const trackRef = dbRef(db, `tracks/${trackId}/audioURL`);

    get(trackRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const audioURL = snapshot.val();
                console.log("File URL:", audioURL);
                downloadFile(audioURL, `track-${trackId}.mp3`);
            } else {
                console.log("No such track exists!");
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}



function downloadFile(fileURL, fileName) {
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}