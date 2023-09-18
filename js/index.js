document.addEventListener('DOMContentLoaded', () => {
    const daysInWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const navDayNumber = Array.from(document.querySelectorAll(".page-nav__day-number"));
    const navDayWeek = Array.from(document.querySelectorAll(".page-nav__day-week"));
    const navDay = Array.from(document.querySelectorAll(".page-nav__day"));
    const today = new Date();
    let timestamp;

    today.setHours(0, 0, 0);
    navDayNumber.forEach((navDayNumber, i) => {
        const date = new Date(today.getTime() + i * 60 * 60 * 24 * 1000);
        navDayNumber.textContent = date.getDate();
        navDayWeek[i].textContent = daysInWeek[date.getDay()];
        navDay[i].dataset.timestamp = date.getTime();
        if (date.getDay() === 0 || date.getDay() === 6) {
            navDay[i].classList.add("page-nav__day_weekend"); 
        } else {
            navDay[i].classList.remove("page-nav__day_weekend");
        }
    });
      

    callback = function callback(response) {
        const main = document.querySelector("main");
        const data = {
            films: response.films.result,
            seances: response.seances.result,
            halls: response.halls.result.filter((hall) => hall.hall_open === '1'),
        };

        data.films.forEach((film) => {
            let seancesHallHTML = '';

            data.halls.forEach((hall) => {
                const seances = data.seances.filter((seance) => seance.seance_hallid === hall.hall_id && seance.seance_filmid === film.film_id);
                if (seances.length > 0) {
                    seancesHallHTML += `
                        <div class="movie-seances__hall">
                        <h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
                        <ul class="movie-seances__list">`
                    seances.forEach((seance) => {
                        seancesHallHTML += `<li class="movie-seances__time-block"><a class="movie-seances__time" href="hall.html"  data-film-name="${film.film_name}" data-film-id="${film.film_id}" data-hall-id="${hall.hall_id}" data-hall-name="${hall.hall_name}" data-price-vip="${hall.hall_price_vip}" data-price-standart="${hall.hall_price_standart}" data-seance-id="${seance.seance_id}" data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}">${seance.seance_time}</a></li>`;
                    });
                    seancesHallHTML += `
                            </ul>
                        </div>`
                }
            })

            if (seancesHallHTML) {
                main.innerHTML += `
                <section class="movie">
                    <div class="movie__info">
                        <div class="movie__poster">
                        <img class="movie__poster-image" alt="${film.film_name} постер" src="${film.film_poster}">
                        </div>
                        <div class="movie__description">
                        <h2 class="movie__title">${film.film_name}</h2>
                        <p class="movie__synopsis">${film.film_description}</p>
                        <p class="movie__data">
                            <span class="movie__data-duration">${film.film_duration} минут</span>
                            <span class="movie__data-origin">${film.film_origin}</span>
                        </p>
                        </div>
                    </div>
                    ${seancesHallHTML}
                </section>`; 
            }
        });

        const movieTime = document.querySelectorAll(".movie-seances__time");

        navDay.forEach((link) => {
            link.addEventListener("click", () => {
                document.querySelector(".page-nav__day_chosen").classList.remove("page-nav__day_chosen");
                link.classList.add("page-nav__day_chosen");
                timestamp = link.dataset.timestamp;
                checkMovieTime();
            })
        })

        navDay[0].click();

        function checkMovieTime() {
            movieTime.forEach((element) => {
                let movieTimestamp = Number(element.dataset.seanceStart) * 60 * 1000 + Number(timestamp);
                let now = new Date();
                if (movieTimestamp < now.getTime()) {
                    element.classList.add("movie-seance__disabled");
                } else {
                    element.classList.remove("movie-seance__disabled");
                } 
            })
        }

        movieTime.forEach((seance) => {
				seance.addEventListener("click", () => {
					let hallConfig = data.halls.find((hall) => hall.hall_id == seance.dataset.hallId).hall_config;
					const thatSeance = {
						...seance.dataset,
						hallConfig: hallConfig,
                        timestamp: (Math.trunc(timestamp / 1000) + seance.dataset.seanceStart * 60),
					};
					localStorage.clear();
					localStorage.setItem("thatSeance", JSON.stringify(thatSeance));
				})
            })
    }

    serverRequest("event=update", callback);
})