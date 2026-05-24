# Voci dialettali con pronuncia/grafia identiche

Voci in cui le due parti separate da `/` nei campi `mn/sp/ge/cr` sono uguali.
In questi casi `formaDisplay` mostra la stessa cosa che la TTS legge — quindi
o sono **bug** (come `paéta da schena/paéta da schena` → corretto in `paeta`)
o sono casi in cui la grafia standard coincide davvero con la pronuncia
(allora basterebbe togliere il `/` e scrivere `mn:"barbabiöla"`).

Da decidere caso per caso.

| Riga | IT | Campo dialettale |
|------|------|------|
| 1849 | barbabietola | `mn="barbabiöla/barbabiöla"` |
| 1850 | piuma | `ge="ciümma/ciümma"` |
| 1864 | cipolla | `mn="cipöla/cipöla"` |
| 2021 | miele | `mn="mèl/mèl"` |
| 2025 | marmellata | `mn="marmelada/marmelada"` |
| 2029 | succo | `mn="sücc/sücc"` |
| 2047 | pasto | `mn="past/past"` |
| 2052 | fungo | `mn="fong/fong"` |
| 2197 | riso | `sp="rìs/rìs"` |
| 2197 | riso | `mn="rìs/rìs"` |
| 2201 | focaccia | `mn="fucassa/fucassa"` |
| 2673 | banana | `mn="banan/banan"` |
| 2674 | limone | `mn="limon/limon"` |
| 2675 | fragola | `mn="fragöla/fragöla"` |
| 2676 | pesca | `mn="pésca/pésca"` |
| 2678 | cocco | `mn="cö/cö"` |
| 2679 | mango | `mn="mangö/mangö"` |
| 2683 | peperone | `mn="peperon/peperon"` |
| 2684 | colazione | `mn="culassion/culassion"` |
| 2687 | ricetta | `mn="ricëta/ricëta"` |
| 2688 | sapore | `mn="savor/savor"` |
| 3095 | ciao | `cr="ciào/ciào"` |

## Azioni possibili

- **Se la grafia è davvero come la pronuncia** → togliere il `/` e lasciare una sola forma. Es: `mn:"barbabiöla"`.
- **Se l'accento serve solo alla TTS** (come `paéta`) → togliere l'accento dalla seconda parte. Es: `mn:"barbabiöla/barbabiola"`.
- **Se vanno corrette entrambe le parti** → riscrivere pronuncia + grafia distinte.
