function serverRequest(body, callback = () => {}) {
    fetch('https://jscp-diplom.netoserver.ru/', {
        method: 'POST',
        body: body,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
    })

    .then((res) => {
        if (res.status >= 200 && res.status < 300) {
            return res.json();
        } else {
            let error = new Error(res.statusText);
            error.response = res;
            throw error;
        }
    })

    .then(res => callback(res))

}