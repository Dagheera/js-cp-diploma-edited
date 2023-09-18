document.addEventListener("DOMContentLoaded", () => {
    const thatTicket = JSON.parse(localStorage.thatSeance);
    console.log(thatTicket);

    const ticketTitle = document.querySelector(".ticket__title");
    const ticketChairs = document.querySelector(".ticket__chairs");
    const ticketHall = document.querySelector(".ticket__hall");
    const ticketStart = document.querySelector(".ticket__start");
	const qr = document.querySelector(".ticket__info-qr");
	let place = ''
	
    ticketTitle.textContent = thatTicket.filmName;

    thatTicket.placesSelected.forEach((e, i) => {
        if (i) {
            place += ", ";
        }
        place += e.row + '/' + e.place;
    })
	ticketChairs.textContent = place;

    ticketHall.textContent = Array.from(thatTicket.hallName).pop();
    ticketStart.textContent = thatTicket.seanceTime;

    const date = new Date(Number(thatTicket.timestamp) * 1000);
	const seanceDate = formatDate(date);

	let text = `ЭЛЕКТРОННЫЙ БИЛЕТ\nНа фильм: ${thatTicket.filmName}\nРяд/Место ${place}\nВ зал: ${Array.from(thatTicket.hallName).pop()}\nНачало сеанса: ${seanceDate} в ${thatTicket.seanceTime} `;
	const qrcode = QRCreator(text, {
		image: "SVG"
	});
	qr.append(qrcode.result);

	function formatDate(date) {

		let dd = date.getDate();
		if (dd < 10) dd = '0' + dd;
	  
		let mm = date.getMonth() + 1;
		if (mm < 10) mm = '0' + mm;
	  
		let yy = date.getFullYear() % 100;
		if (yy < 10) yy = '0' + yy;
	  
		return dd + '.' + mm + '.' + yy;
	}
})