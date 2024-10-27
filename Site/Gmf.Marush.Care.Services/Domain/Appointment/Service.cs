using Gmf.DDD.Common.Abstractions;
using Gmf.Mail.Common.Contracts;
using Gmf.Mail.Common.Models;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Contracts.Services.Appointments;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Services.Domain.Appointment;

public class Service(IAppointmentRepository appointmentRepository, IEmailClient emailService) : IMakeAppointments
{
    private readonly IAppointmentRepository _appointmentRepository = appointmentRepository ?? throw new ArgumentNullException(nameof(appointmentRepository));
    private readonly IEmailClient _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));

    public async Task ScheduleAppointmentFor(Customer customer, Period period)
    {
        await _appointmentRepository.Schedule(customer, period);
        var message = new EmailMessage("Marush: Space of Care - zahtev za zakazivanje termina je podnet", "Podnet zahtev!", new[] { customer.Email });
        await _emailService.Send(message);
    }
}
