// 1️⃣ Load logo
fetch('logo.html')
  .then(r => r.text())
  .then(html => {
    document.getElementById('logo-placeholder').innerHTML = html;
  })
  .catch(err => console.error('Error loading logo:', err));

// 2️⃣ Load menu
fetch('menu.html')
  .then(r => r.text())
  .then(html => {
    document.getElementById('menu-placeholder').innerHTML = html;

    // 3️⃣ Initialize collapsibles
    const collapsibles = document.querySelectorAll('.collapsible');
    collapsibles.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();

        // Toggle submenu if it exists
        const submenu = item.nextElementSibling;
        if (submenu && submenu.classList.contains('submenu-collapsible')) {
          submenu.classList.toggle('show');
        }

        // Toggle + / - sign if text includes them
        if (item.textContent.includes('+') && submenu && submenu.classList.contains('show')) {
          item.textContent = item.textContent.replace('+','-');
        } else if (item.textContent.includes('-') && submenu && !submenu.classList.contains('show')) {
          item.textContent = item.textContent.replace('-','+');
        }

        // Load page if data-page attribute exists
        const page = item.dataset.page;
        if (page) {
          fetch(`pages/${page}.html`)
            .then(r => r.text())
            .then(html => {
              document.querySelector('.center').innerHTML = html;
            })
            .catch(err => console.error(`Error loading ${page}:`, err));
        }
      });
    });

    // 4️⃣ SPA content loading for menu links (<a data-page>)
    const pageLinks = document.querySelectorAll('.right a[data-page]');
    pageLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const page = link.dataset.page;
        fetch(`pages/${page}.html`)
          .then(r => r.text())
          .then(html => {
            document.querySelector('.center').innerHTML = html;
          })
          .catch(err => console.error(`Error loading ${page}:`, err));

        // Expand submenu if applicable
        const collapsible = link.closest('.collapsible');
        if (collapsible) {
          const submenu = collapsible.nextElementSibling;
          if (submenu && submenu.classList.contains('submenu-collapsible')) {
            submenu.classList.add('show');
            if (collapsible.textContent.includes('+')) {
              collapsible.textContent = collapsible.textContent.replace('+','-');
            }
          }
        }
      });
    });

    // 5️⃣ Auto-load page if URL hash is present
    const hash = window.location.hash.substring(1); // remove #
    if (hash) {
      const link = document.querySelector(`.right [data-page="${hash}"]`);
      if (link) {
        fetch(`pages/${hash}.html`)
          .then(r => r.text())
          .then(html => {
            document.querySelector('.center').innerHTML = html;
          })
          .catch(err => console.error(`Error loading ${hash}:`, err));
      }
    }

  })
  .catch(err => console.error('Error loading menu:', err));
