/**
 * VARUN JOSHI - CURRICULUM VITAE VIEWER INTERACTIVITY SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomResetBtn = document.getElementById('zoomResetBtn');
    const zoomLevelDisplay = document.getElementById('zoomLevelDisplay');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const cvScaleContainer = document.getElementById('cvScaleContainer');
    const cvMainWrapper = document.getElementById('cvMainWrapper');
    const cvPdfFrame = document.getElementById('cvPdfFrame');
    const cvFallbackContainer = document.getElementById('cvFallbackContainer');

    let currentScale = 1.0;
    const MIN_SCALE = 0.6;
    const MAX_SCALE = 2.0;
    const SCALE_STEP = 0.15;

    function updateZoom() {
        cvScaleContainer.style.transform = `scale(${currentScale})`;
        zoomLevelDisplay.textContent = `${Math.round(currentScale * 100)}%`;
        
        if (currentScale > 1.0) {
            cvScaleContainer.style.transformOrigin = 'top center';
        } else {
            cvScaleContainer.style.transformOrigin = 'top center';
        }
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (currentScale < MAX_SCALE) {
                currentScale += SCALE_STEP;
                updateZoom();
            }
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (currentScale > MIN_SCALE) {
                currentScale -= SCALE_STEP;
                updateZoom();
            }
        });
    }

    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', () => {
            currentScale = 1.0;
            updateZoom();
        });
    }

    // Fullscreen Toggle
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                if (cvMainWrapper.requestFullscreen) {
                    cvMainWrapper.requestFullscreen();
                } else if (cvMainWrapper.webkitRequestFullscreen) {
                    cvMainWrapper.webkitRequestFullscreen();
                }
                fullscreenBtn.querySelector('i').className = 'fa-solid fa-compress';
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
                fullscreenBtn.querySelector('i').className = 'fa-solid fa-expand';
            }
        });

        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                fullscreenBtn.querySelector('i').className = 'fa-solid fa-expand';
            }
        });
    }

    // Mobile PDF fallback detection
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile && cvPdfFrame && cvFallbackContainer) {
        cvPdfFrame.addEventListener('error', () => {
            cvScaleContainer.style.display = 'none';
            cvFallbackContainer.style.display = 'flex';
        });
    }
});
