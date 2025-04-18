﻿using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Gmf.Net.Core.Common.Initialization.Converters;
public sealed class DateOnlyJsonConverter : JsonConverter<DateOnly>
{
    private readonly string[] _supportedFormats = ["d.M.yyyy.", "MM/dd/yyyy", "dd.MM.yyyy"];

    public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) => DateOnly.TryParseExact(reader.GetString(), _supportedFormats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
            ? date
            : throw new JsonException("Unsupported date format!");

    public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options) => writer.WriteStringValue(value.ToString(CultureInfo.CurrentCulture));
}
