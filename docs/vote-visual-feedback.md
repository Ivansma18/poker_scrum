# Feedback Visual Al Votar

## Contexto

Los participantes pueden seleccionar cartas de planning poker para votar, y la carta seleccionada se muestra visualmente resaltada. Sin embargo, la app debe proporcionar una confirmación explícita de que el voto fue registrado, especialmente en móvil o en reuniones remotas donde los usuarios necesitan confianza después de tocar.

## Objetivo

Proporcionar un feedback visual claro después de que un participante vote para que sepa que su selección fue registrada.

## Alcance

- Mejorar el estado visual de la carta seleccionada.
- Mostrar un mensaje de confirmación breve después de un voto exitoso.
- Mantener la confirmación visible lo suficiente para tranquilizar al usuario sin interrumpir la sesión.
- Asegurar que los espectadores y las rondas reveladas no muestren confirmación de voto engañosa.
- Preservar las reglas de votación existentes.

## Requisitos Funcionales

1. Cuando un participante selecciona una carta, esa carta debe permanecer visualmente seleccionada.
2. Después de un voto exitoso, mostrar un mensaje de confirmación cerca del deck de votación.
3. El mensaje de confirmación debe incluir el valor del voto seleccionado.
4. El conteo de votos en el encabezado de la sala debe actualizarse como lo hace hoy.
5. Seleccionar una carta diferente debe actualizar el estado seleccionado y el mensaje de confirmación.
6. La confirmación no debe mostrarse para espectadores.
7. La confirmación no debe mostrarse si la ronda ya fue revelada y la votación está cerrada.
8. La confirmación debe ser comprensible sin depender solo del color.
9. El feedback debe funcionar en móvil y escritorio.
10. La implementación debe mantener las reglas de votación en dominio/aplicación; React solo debe mostrar feedback basado en el resultado/estado de la votación.

## Requisitos Técnicos

1. Rastrear la última confirmación de voto exitoso en el estado de presentación.
2. Limpiar o reemplazar la confirmación cuando el participante cambie su voto.
3. Limpiar la confirmación cuando la ronda se reinicie, cambie la historia, cambie la baraja, o la sala ya no tenga ese voto.
4. Usar un componente de feedback reutilizable si es posible.
5. Mantener el deck de votación presentacional.
6. Validar con `npm run lint` y `npm run build`.

## Criterios de Aceptación

1. Dado que un participante toca una carta, la carta muestra un estado seleccionado claro.
2. Dado que un participante toca una carta, aparece un mensaje indicando que su voto fue registrado.
3. Dado que el participante selecciona otra carta, el estado seleccionado y el mensaje se actualizan.
4. Dado que el participante es un espectador, no se muestra confirmación de voto.
5. Dado que la ronda está revelada, no se muestra nueva confirmación de voto.
6. Dado que el voto del participante es limpiado por reinicio/cambio de historia/cambio de baraja, la confirmación desaparece.
7. La confirmación es legible en temas claro y oscuro.
8. La confirmación es visible en móvil sin causar scroll horizontal.
9. `npm run lint` pasa.
10. `npm run build` pasa.

## Supuestos

1. El feedback será inline cerca del deck, no un toast global.
2. El mensaje incluirá el valor votado, por ejemplo "Vote recorded: 5".
3. El mensaje persistirá mientras el voto actual siga siendo válido.
4. Si el usuario cambia de carta, el mensaje se actualiza.
5. Si se limpia la ronda, se cambia historia o se cambia baraja, el mensaje desaparece porque ya no hay voto actual.
6. No se agregará sonido ni vibración háptica.
7. No se mostrará confirmación para espectadores.
8. No se mostrará confirmación si la ronda está revelada.

## Riesgos / Tradeoffs

- Una confirmación persistente puede quedar obsoleta si el estado de la sala cambia remotamente; debe estar vinculada al estado del voto actual.
- Demasiada animación o comportamiento de toast puede distraer durante las reuniones.
- Un mensaje inline corto es más simple y confiable que notificaciones toast con temporizador.
- El resaltado de la carta seleccionada debe seguir siendo el feedback principal; el mensaje de confirmación es una reassurance secundaria.
