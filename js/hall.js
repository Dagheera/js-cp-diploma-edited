document.addEventListener("DOMContentLoaded", () => {
    const thatSeance = JSON.parse(localStorage.thatSeance);
    console.log(thatSeance);

    const movieTitle = document.querySelector(".buying__info-title");
    const movieStart = document.querySelector(".buying__info-start");
    const movieHall = document.querySelector(".buying__info-hall");
    const standartPrice = document.querySelector(".price-standart");
    const vipPrice = document.querySelector(".price-vip");
	const acceptinButton = document.querySelector(".acceptin-button");
	const confStepWrapper = document.querySelector(".conf-step__wrapper");

    movieTitle.textContent = thatSeance.filmName;
    movieStart.textContent = "Начало сеанса: " + thatSeance.seanceTime;
    movieHall.textContent = "Зал " + Array.from(thatSeance.hallName).pop();
    standartPrice.textContent = thatSeance.priceStandart;
    vipPrice.textContent = thatSeance.priceVip;

    callback = function callback(response) {
		if (response) {
			thatSeance.hallConfig = response;
		}
		confStepWrapper.innerHTML = thatSeance.hallConfig;

		const chairs = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair'));
		chairs.forEach((chair) => {
			chair.addEventListener('click', () => {
				if (chair.classList.contains('conf-step__chair_taken')) {
					return;
				}
				chair.classList.toggle('conf-step__chair_selected');
				
				if (chairs.find((chair) => chair.classList.contains('conf-step__chair_selected'))) {
					acceptinButton.removeAttribute("disabled");
				} else {
					acceptinButton.setAttribute("disabled", true);
				}
			});
		});	

    }

	acceptinButton.addEventListener("click", () => {
		const confStepRow = Array.from(document.querySelectorAll(".conf-step__row"));
		thatSeance.hallConfig = confStepWrapper.innerHTML;
		thatSeance.placesSelected = [];

		confStepRow.forEach((row, rowIndex) => {
			const chairs = Array.from(row.querySelectorAll(".conf-step__chair"));
			chairs.forEach((chair, chairIndex) => {
				const type = (chair.classList.contains("conf-step__chair_standart")) ? "standart" : "vip";
				
				if (chair.classList.contains("conf-step__chair_selected")) {
					thatSeance.placesSelected.push({
						row: rowIndex + 1,
						place: chairIndex + 1,
						type: type,
					})
				}
			})
		})

		localStorage.clear();
		localStorage.setItem("thatSeance", JSON.stringify(thatSeance));

		document.location = "payment.html"
	})
        
    const body = `event=get_hallConfig&timestamp=${thatSeance.timestamp}&hallId=${thatSeance.hallId}&seanceId=${thatSeance.seanceId}`;
	serverRequest(body, callback);
})
