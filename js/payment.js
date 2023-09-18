document.addEventListener("DOMContentLoaded", () => {
    const thatTicket = JSON.parse(localStorage.thatSeance);
    console.log(thatTicket);

    const ticketTitle = document.querySelector(".ticket__title");
    const ticketChairs = document.querySelector(".ticket__chairs");
    const ticketHall = document.querySelector(".ticket__hall");
    const ticketStart = document.querySelector(".ticket__start");
    const ticketCost = document.querySelector(".ticket__cost");
    const acceptinButton = document.querySelector(".acceptin-button");
    let totalPrice = 0

    ticketTitle.textContent = thatTicket.filmName;

    ticketChairs.textContent = "";
    thatTicket.placesSelected.forEach((place, i) => {
        if (i) {
            ticketChairs.textContent += ", ";
        }
        ticketChairs.textContent += place.row + '/' + place.place;
        if (place.type === "standart") {
            totalPrice += Number(thatTicket.priceStandart);
        } else if (place.type === "vip") {
            totalPrice += Number(thatTicket.priceVip);
        }
    })

    ticketHall.textContent = Array.from(thatTicket.hallName).pop();
    ticketStart.textContent = thatTicket.seanceTime;
    ticketCost.textContent = totalPrice;
    
    acceptinButton.addEventListener("click", () => {
		const hallConfig = thatTicket.hallConfig.replace(/selected/g, "taken");
        const body = `event=sale_add&timestamp=${thatTicket.timestamp}&hallId=${thatTicket.hallId}&seanceId=${thatTicket.seanceId}&hallConfiguration=${hallConfig}`;
        console.log(body);
	    console.log(thatTicket.timestamp);
        serverRequest(body);
		document.location = "ticket.html"
	})
    
})