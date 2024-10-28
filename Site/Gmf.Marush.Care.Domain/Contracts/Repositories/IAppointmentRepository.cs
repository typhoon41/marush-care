﻿using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Repositories;

public interface IAppointmentRepository
{
    Task Schedule(Customer customer, Period appointment);
}