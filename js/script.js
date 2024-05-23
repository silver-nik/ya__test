document.addEventListener('DOMContentLoaded', () =>  {

    let slider = (container, navigationContainer, showedSlidesCount, bool, infinite) => {

        let   slider = document.querySelector(container),
                navContent = document.querySelector(navigationContainer),
                slides = slider.querySelectorAll('.slider-item__carousel'),
                sliderCounter = navContent.querySelector('.current-count'),
                slidesSummary = navContent.querySelector('.summary-count'),
                prevArrow = navContent.querySelector('.navigation-arrow-prev'),
                nextArrow = navContent.querySelector('.navigation-arrow-next'),
                slidesWrapper = slider.querySelector('.slider-wrapper__carousel'),
                slidesContainer = slider.querySelector('.slider-inner__carousel'),
                widthAllSlides = window.getComputedStyle(slidesWrapper).width,
                widthSingleSlide = slides[0].offsetWidth;

        let showedSlides = showedSlidesCount;
        let autoPlayInterval;

        if(infinite) {
            for (let i = 0; i < showedSlides; i++) {
                const clonedSlide = slides[i].cloneNode(true);
                clonedSlide.classList.add('clonned');
                slidesContainer.appendChild(clonedSlide);
            }
            
            for (let i = slides.length - showedSlides; i < slides.length; i++) {
                const clonedSlide = slides[i].cloneNode(true);
                clonedSlide.classList.add('clonned');
                slidesContainer.insertBefore(clonedSlide, slides[0]);
            }

            slides = slider.querySelectorAll('.slider-item__carousel');
        }

        let i = infinite ? showedSlides : 0;
        let additionalOffset = 20;
        let widthWithOffset = widthSingleSlide + additionalOffset;
        let offset = infinite ? widthWithOffset * showedSlides : 0;
    
        slidesContainer.style.display = 'flex';
        infinite ? slidesContainer.style.transform = `translateX(-${offset}px)` : slidesContainer.style.transform = `translateX(0px)`
        slidesWrapper.style.width = widthWithOffset * showedSlides + 'px';
        slidesContainer.style.width =  widthAllSlides;
        slidesSummary ? slidesSummary.textContent = slides.length - (showedSlides * 2) : '';
        sliderCounter ? sliderCounter.innerHTML = showedSlides : ''

        const cloneSwap = () => {

            if(infinite) {

                if(offset >= widthWithOffset * (slides.length - showedSlides)) {
                    i = showedSlides;
                    offset = widthWithOffset * showedSlides;
                }    
                
                if (offset <= 0) {
                    i = slides.length - (showedSlides * 2);
                    offset = widthWithOffset * i;
                }

            }

            setCounter(i);
            slidesContainer.style.transform = `translateX(-${offset}px)`;
            slidesContainer.style.transition = 'none';
        }

        const setCounter = (value) => {
            if(sliderCounter) {
                return sliderCounter.textContent = value;
            }
        }

        const setDotted = () => {
            try {
                slides.forEach((el, i) => {
                    const dot = document.createElement('div');
                          dot.classList.add('dot-item');

                    return slider.querySelector('.navigation-dots').append(dot);
                })
            } catch(e) {}
        }

        const activateDotted = (iter = 0) => {
            slider.querySelectorAll('.dot-item').forEach((el, i) => {
                i == iter ? el.classList.add('active') : el.classList.remove('active')
            })
        }

        const btnToggleDisabled = (btn, bool) => {
            bool ? btn.classList.add('disabled') : btn.classList.remove('disabled');
        }

        const autoPlay = (bool) => {
            
            if (bool) {
                autoPlayInterval = setInterval(() => {
                    offset += widthWithOffset * showedSlides;
                    i += showedSlides;
        
                    if (i >= slides.length - showedSlides) {
                        setCounter(showedSlides);
                    } else {
                        setCounter(i);
                    }
        
                    slidesContainer.style.transition = '0.5s all';
                    slidesContainer.style.transform = `translateX(-${offset}px)`;
        
                }, 4000);
            } else {
                clearInterval(autoPlayInterval);
            }

        }

        [slidesContainer, navContent].forEach(el => {
            el.addEventListener('mouseenter', () => {
                autoPlay(false);
            });

            el.addEventListener('mouseleave', () => {
                autoPlay(true);
            });
        })

        slidesContainer.addEventListener('transitionend', () => {
            cloneSwap();
        })

        nextArrow.addEventListener('mouseup', (e) => {
            e.preventDefault();

            
            if (i === slides.length - showedSlides) {
                if(infinite) {
                    i = showedSlides;
                    offset = widthWithOffset * showedSlides;
                    setCounter(i);
                }
            }
        
            else {
                offset += widthWithOffset * showedSlides;
                i += showedSlides;

                activateDotted(i);
                btnToggleDisabled(nextArrow, false);
                btnToggleDisabled(prevArrow, false);

                if(!infinite && i == slides.length - showedSlides) {

                    console.log(i);
                    console.log(slides.length);
                    btnToggleDisabled(nextArrow, true);
                }

                if(i >= slides.length - showedSlides) {
                    setCounter(showedSlides);
                    activateDotted(i);
                } else {
                    setCounter(i);
                }

                slidesContainer.style.transition = '0.5s all';

            }
            
            slidesContainer.style.transform = `translateX(-${offset}px)`;

        });

        
        prevArrow.addEventListener('mouseup', (e) => {
            e.preventDefault();
            
            if (i < showedSlides) {
                
                if(infinite) {
                    i = slides.length - showedSlides * 2;
                    offset = 0;
                }
            }
        
            else {
                offset -= widthWithOffset * showedSlides;
                i -= showedSlides;


                activateDotted(i);
                btnToggleDisabled(prevArrow, false);
                btnToggleDisabled(nextArrow, false);

                if(!infinite && i == 0) {

                    console.log(i);
                    console.log(slides.length);
                    btnToggleDisabled(prevArrow, true);
                }


                if(infinite) {
                    if(i < showedSlides) {
                        i = slides.length - (showedSlides * 2);
                        setCounter(slides.length - (showedSlides * 2));
                    } else {
                        setCounter(i);
                    }
                } else {
                    if(i < 0) {
                        i = 0;
                        setCounter(showedSlides)
                    } else {
                        setCounter(i);
                    }
                }

                slidesContainer.style.transition = '0.5s all';

            }
            
            slidesContainer.style.transform = `translateX(-${offset}px)`;

        });

        setDotted();
        activateDotted();
        autoPlay(bool);

        if(!infinite) {
            btnToggleDisabled(prevArrow, true);
        }
    
    }

    
    if(document.documentElement.clientWidth <= 768) {
        slider('.stages', '.stages__list-container__navigation', 1, false, false);  
        slider('.members__title-container__slider', '.members__title-container__navigation', 1, true, true);
    } else {
        slider('.members__title-container__slider', '.members__title-container__navigation', 3, true, true);
    }

})