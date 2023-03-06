// Define los eventos
var eventos = [
    {
      id: 1,
      title: 'Evento 1',
      start: '2023-03-15T10:30:00',
      end: '2023-03-15T12:30:00'
    },
    {
      id: 2,
      title: 'Evento 2',
      start: '2023-03-17T12:00:00',
      end: '2023-03-17T13:30:00'
    },
    {
      id: 3,
      title: 'Evento 3',
      start: '2023-03-20T09:00:00',
      end: '2023-03-20T11:00:00'
    }
  ];
  
  // Crea una instancia del calendario
  var calendarEl = document.getElementById('calendario');
  var calendario = new FullCalendar.Calendar(calendarEl, {
    plugins: ['dayGrid', 'timeGrid', 'list'],
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    defaultView: 'dayGridMonth',
    defaultDate: '2023-03-01',
    editable: true,
    eventLimit: true,
    events: eventos,
    // Agrega un evento cuando se hace clic en un día
    dateClick: function(info) {
      var fecha = info.dateStr;
      var titulo = prompt('Ingrese el título del evento:');
      if (titulo) {
        calendario.addEvent({
          title: titulo,
          start: fecha
        });
      }
    }
  });
  
  // Renderiza el calendario
  calendario.render();
  