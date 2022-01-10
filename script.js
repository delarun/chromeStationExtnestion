function getCookies(domain, name, callback) {
    chrome.cookies.get({ "url": domain, "name": name }, function (cookie) {
        if (callback) {
            callback(cookie.value);
        }
    });
}
let container = document.getElementsByClassName("container")[0];
chrome.storage.local.get('ydid', function (data) {
    if (data['ydid'] != undefined) {
        getCookies("https://yandex.ru", "Session_id", function (id) {
            if (id != undefined) {
                document.getElementById('ydbut').onclick = () => {
                    fetch("https://frontend.vh.yandex.ru/csrf_token", {
                        headers: {
                            'cookie': "Session_id=" + id
                        }
                    }).then(resp => resp.text())
                        .then(resp => {
                            alert(id)
                            let vidurl = document.getElementById("ydurl").value;
                            let pt = "video_url";
                            if (vidurl.includes("https://youtu")) pt = "youtube";
                            fetch("https://yandex.ru/video/station", {
                                headers: {
                                    'Origin': "http://yandex.ru",
                                    'Content-Type': 'application/json',
                                    "cookie": "Session_id=" + id,
                                    "x-csrf-token": resp
                                },
                                method: "POST",
                                body: JSON.stringify({ "msg": { "player_id": pt, "provider_item_id": vidurl, "start_position": 0 }, "device": data['ydid'] })
                            }).then(respy => respy.json())
                                .then(respy => {
                                    alert(respy)
                                    if (respy['status'] == "play") alert("Видео отправленно")
                                })
                        })
                }
            }
        })
    } else {
        container.innerHTML = "";
        getCookies("https://yandex.ru", "Session_id", function (id) {
            if (id != undefined) {
                fetch("https://quasar.yandex.ru/devices_online_stats", { headers: { 'cookie': "Session_id=" + id } }).then(resp => resp.json()).then(resp => {
                    if (resp['status'] == "error") {
                        alert("Пожалуйста, залогиньтесь на yandex.ru");
                    } else {
                        devs = "";
                        resp['items'].forEach(element => {
                            devs += "<option value='" + element['id'] + "'>" + element['name'] + "</option>"
                        });
                        let devs_select = "<select id='yd'>" + devs + "</select><button id='ydevbtn'type='submit'>Продолжить</button>"
                        container.innerHTML = devs_select;
                        document.getElementById("ydevbtn").onclick = () => {
                            chrome.storage.local.set({ "ydid": document.getElementById("yd").value }, function () {
                                alert("Id выбранного устройства: " + document.getElementById("yd").value);
                                chrome.runtime.reload();
                            });
                        }
                    }
                })
            } else {
                alert("Пожалуйста, залогиньтесь на yandex.ru")
            }
        });

    }
})