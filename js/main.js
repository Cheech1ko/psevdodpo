// ============================================
// АНО ДПО «Образовательный стандарт» — общий скрипт
// ============================================

function openModal(){ document.getElementById('modalOverlay').classList.add('active'); document.body.style.overflow='hidden'; }
function closeModal(){ document.getElementById('modalOverlay').classList.remove('active'); document.body.style.overflow=''; }

document.addEventListener('DOMContentLoaded', function(){

  // modal
  var overlay = document.getElementById('modalOverlay');
  if(overlay){
    overlay.addEventListener('click', function(e){ if(e.target===this) closeModal(); });
  }
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });

  // sticky header shadow
  var header = document.getElementById('siteHeader');
  if(header){
    window.addEventListener('scroll', function(){
      header.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  // mobile nav
  var burger = document.getElementById('burger');
  var mobileNav = document.getElementById('mobileNav');
  var scrim = document.getElementById('scrim');
  var mnClose = document.getElementById('mnClose');

  function openNav(){
    burger.classList.add('open');
    mobileNav.classList.add('open');
    scrim.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeNav(){
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
    scrim.classList.remove('open');
    document.body.style.overflow='';
  }
  if(burger){
    burger.addEventListener('click', function(){
      mobileNav.classList.contains('open') ? closeNav() : openNav();
    });
  }
  if(mnClose) mnClose.addEventListener('click', closeNav);
  if(scrim) scrim.addEventListener('click', closeNav);
  document.querySelectorAll('.mobile-nav a').forEach(function(a){ a.addEventListener('click', closeNav); });

  // scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, {threshold:.15});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  // count-up
  var counters = document.querySelectorAll('[data-count]');
  if(counters.length && 'IntersectionObserver' in window){
    var countIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          var duration = 1400;
          var start = performance.now();
          function tick(now){
            var p = Math.min((now-start)/duration, 1);
            var eased = 1 - Math.pow(1-p, 3);
            el.textContent = Math.floor(eased*target).toLocaleString('ru-RU');
            if(p<1) requestAnimationFrame(tick); else el.textContent = target.toLocaleString('ru-RU')+'+';
          }
          requestAnimationFrame(tick);
          countIO.unobserve(el);
        }
      });
    }, {threshold:.5});
    counters.forEach(function(el){ countIO.observe(el); });
  }

  // course filter tabs (courses.html)
  var tabs = document.querySelectorAll('.filter-tab');
  var groups = document.querySelectorAll('.course-group');
  if(tabs.length){
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        tabs.forEach(function(t){ t.classList.remove('active'); });
        tab.classList.add('active');
        var cat = tab.getAttribute('data-cat');
        groups.forEach(function(g){
          if(cat === 'all' || g.getAttribute('data-cat') === cat){
            g.style.display = '';
          } else {
            g.style.display = 'none';
          }
        });
      });
    });
  }

  // mark active nav link
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.primary a, .mobile-nav a').forEach(function(a){
    var href = a.getAttribute('href');
    if(href === path || (path === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });
});
