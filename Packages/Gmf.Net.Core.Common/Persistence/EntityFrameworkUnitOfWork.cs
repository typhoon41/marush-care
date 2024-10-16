﻿using Gmf.DDD.Common.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.Net.Core.Common.Persistence;

[ExcludeFromCodeCoverage]
public class EntityFrameworkUnitOfWork : IUnitOfWork
{
    private readonly DbContext _context;
    private readonly ILogger<EntityFrameworkUnitOfWork> _logger;
    private bool _cancelSaving;

    public EntityFrameworkUnitOfWork([NotNull] DbContext context, [NotNull] ILogger<EntityFrameworkUnitOfWork> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        if (_cancelSaving)
        {
            _logger.LogDebug("Not saving database changes since saving was cancelled.");
            return 0;
        }

        var numberOfChanges = await _context.SaveChangesAsync(cancellationToken);
        _logger.LogDebug("{NumberOfChanges} changes were saved to database", numberOfChanges);
        return numberOfChanges;
    }

    public void CancelSaving() => _cancelSaving = true;
}
