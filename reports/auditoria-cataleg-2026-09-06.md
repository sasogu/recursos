# Auditoría del catálogo de Bibliojocs — privacidad, obsolescencia y adecuación didáctica

- Fecha: 2026-09-06
- Catálogo analizado: `data/games.json` (3004 juegos, 335 dominios distintos)
- Estado de enlaces: `reports/link-report.json` regenerado hoy (2793 URL, 89 con error/aviso)

## Resumen ejecutivo

| Decisión | Juegos | % |
|---|---|---|
| 🟢 MANTENER | 1978 | 65% |
| 🔴/🟡 RETIRAR | 1026 | 34% |

**Propuesta**: retirar 1026 entradas (≈34 %) que incumplen el criterio de privacidad del Commons (publicidad/rastreo/registro de terceros), son enlaces obsoletos, o no son juegos educativos adecuados para la edad (software de escritorio, herramientas con cuenta, portales de contenido, juegos casuales de entretenimiento).

> Aviso: es una auditoría técnica heurística (por dominio + comprobación HTTP), **no una certificación jurídica**. Los casos dudosos están marcados para revisión manual antes de aplicar cambios.

## Metodología

Adaptación del *Privacy Check* de EduTicTac Commons a los **destinos enlazados** (los juegos se abren en pestaña nueva sobre la web del tercero):
- 🟢 **Adecuada**: sin publicidad ni rastreo de terceros, sin registro obligatorio, contenido educativo apto.
- 🟡/🔴 **Retirar**: publicidad no desactivable, trackers estructurales, registro/cuenta del menor, pago, o dominio muerto/comprometido.
- Regla del producto Commons: en el catálogo final solo quedan destinos 🟢.
- **Criterio didáctico**: además, se retiran recursos que no son *juegos/actividades interactivas* (software descargable, herramientas de edición con cuenta, diccionarios/portales) o que no son apropiados para el público (Infantil–Secundaria) por contenido casual/violento sin intención educativa.

## 1. Privacidad — publicidad / rastreo / registro / suscripción

*17 dominios, 329 juegos*

| Dominio | Juegos | Motivo |
|---|---|---|
| cristic.my.canva.site | 108 | Canva/trackers + 404 home |
| youtube.com | 60 | youtube trackers/contenido no moderado |
| ecasals.net | 38 | requiere login/licencia |
| eslgamesplus.com | 28 | publicidad |
| filesecasals.net | 22 | requiere login/licencia |
| mathplayground.com | 19 | publicidad |
| sheppardsoftware.com | 17 | publicidad |
| happylearning.tv | 12 | suscripción de pago |
| world-geography-games.com | 8 | publicidad |
| aprendomusica.com | 6 | publicidad |
| es.educaplay.com | 3 | publicidad |
| g.co | 3 | redirector Google |
| mapasinteractivos.didactalia.net | 1 | publicidad |
| nctm.org | 1 | membresía de pago |
| interactive-resources.co.uk | 1 | suscripción escolar |
| timeforkids.com | 1 | suscripción+publicidad |
| 3cat.cat | 1 | TV3 reproductor, no juego |

## 2. Obsoleto / roto / muerto

*7 dominios, 90 juegos*

| Dominio | Juegos | Motivo |
|---|---|---|
| genmagic.net | 53 | obsoleto/roto |
| recursosyoaprendoencasa.grupo-sm.com | 14 | inaccesible/editorial |
| clarionweb.es | 12 | Flash obsoleto |
| angles365.com | 8 | caído |
| pianolessons4children.com | 1 | obsoleto (enlace roto) |
| teachflix.org | 1 | sitio comprometido/spam |
| onio72.github.io | 1 | obsoleto (enlace roto) |

## 3. No es un juego educativo (software / herramienta / portal)

*219 dominios, 246 juegos*

| Dominio | Juegos | Motivo |
|---|---|---|
| static.tinytap.com | 7 | no juego/herramienta/privacidad |
| bbc.co.uk | 4 | no juego/herramienta/privacidad |
| artsandculture.google.com | 4 | no juego (software/herramienta/portal) |
| cdn1.edgedatg.com | 3 | no juego/herramienta/privacidad |
| apliense.xtec.cat | 3 | no juego (software/herramienta/portal) |
| diccionari.cat | 3 | no juego (software/herramienta/portal) |
| app.codemonkey.com | 2 | no juego (software/herramienta/portal) |
| llengua.gencat.cat | 2 | portal contenido |
| takatamuser.com | 2 | no juego/herramienta/privacidad |
| typinggames.zone | 2 | no juego/herramienta/privacidad |
| linkat.xtec.cat | 2 | portal no juego |
| salvador-dali.org | 2 | no juego (software/herramienta/portal) |
| bibliotecavirtual.diba.cat | 2 | no juego/herramienta/privacidad |
| tintin.com | 2 | no juego (software/herramienta/portal) |
| climate.nasa.gov | 2 | no juego (software/herramienta/portal) |
| comodicequedijo.com | 1 | no juego (software/herramienta/portal) |
| aplicaciones.info | 1 | no juego/herramienta/privacidad |
| incredibox.com | 1 | no juego/herramienta/privacidad |
| tony-b.org | 1 | no juego/herramienta/privacidad |
| youdj.online | 1 | no juego/herramienta/privacidad |
| composing-with-kids.web.app | 1 | no juego (software/herramienta/portal) |
| beepbox.co | 1 | no juego/herramienta/privacidad |
| juegos-geograficos.com | 1 | no juego/herramienta/privacidad |
| ntic.educacion.es | 1 | no juego (software/herramienta/portal) |
| license.novelgames.com | 1 | no juego/herramienta/privacidad |
| espaiescoles.farmaceuticonline.com | 1 | no juego (software/herramienta/portal) |
| lego.com | 1 | no juego/herramienta/privacidad |
| view.genially.com | 1 | no juego (software/herramienta/portal) |
| imusic-school.com | 1 | no juego/herramienta/privacidad |
| microstudio.dev | 1 | no juego (software/herramienta/portal) |
| monogame.net | 1 | no juego (software/herramienta/portal) |
| unity.com | 1 | no juego (software/herramienta/portal) |
| gamemaker.io | 1 | no juego (software/herramienta/portal) |
| wokwi.com | 1 | no juego (software/herramienta/portal) |
| rodocodo.com | 1 | no juego (software/herramienta/portal) |
| easygamemaker.com | 1 | no juego (software/herramienta/portal) |
| codingame.com | 1 | no juego (software/herramienta/portal) |
| 8bitworkshop.com | 1 | no juego (software/herramienta/portal) |
| codedex.io | 1 | no juego (software/herramienta/portal) |
| godotengine.org | 1 | no juego (software/herramienta/portal) |
| rpgplayground.com | 1 | no juego (software/herramienta/portal) |
| gbstudio.dev | 1 | no juego (software/herramienta/portal) |
| tynker.com | 1 | no juego (software/herramienta/portal) |
| lab.open-roberta.org | 1 | no juego (software/herramienta/portal) |
| alice.org | 1 | no juego (software/herramienta/portal) |
| sonic-pi.net | 1 | no juego (software/herramienta/portal) |
| freecodecamp.org | 1 | no juego (software/herramienta/portal) |
| appinventor.mit.edu | 1 | no juego (software/herramienta/portal) |
| codecombat.com | 1 | no juego (software/herramienta/portal) |
| developer.apple.com | 1 | no juego/herramienta/privacidad |
| thunkable.com | 1 | no juego/herramienta/privacidad |
| scratchjr.org | 1 | no juego (software/herramienta/portal) |
| robocode.sourceforge.io | 1 | no juego (software/herramienta/portal) |
| code.intef.es | 1 | no juego (software/herramienta/portal) |
| make.gamefroot.com | 1 | no juego (software/herramienta/portal) |
| gdevelop.io | 1 | no juego (software/herramienta/portal) |
| mimo.org | 1 | no juego (software/herramienta/portal) |
| kodugamelab.com | 1 | no juego (software/herramienta/portal) |
| linuxmint.com | 1 | no juego (software/herramienta/portal) |
| libreoffice.org | 1 | no juego (software/herramienta/portal) |
| librecad.org | 1 | no juego (software/herramienta/portal) |
| krita.org | 1 | no juego (software/herramienta/portal) |
| avidemux.sourceforge.net | 1 | no juego (software/herramienta/portal) |
| opentoonz.github.io | 1 | no juego (software/herramienta/portal) |
| audacityteam.org | 1 | no juego (software/herramienta/portal) |
| openshot.org | 1 | no juego (software/herramienta/portal) |
| openscad.org | 1 | no juego (software/herramienta/portal) |
| ardour.org | 1 | no juego (software/herramienta/portal) |
| natrongithub.github.io | 1 | no juego (software/herramienta/portal) |
| gimp.org | 1 | no juego (software/herramienta/portal) |
| batocera.org | 1 | no juego (software/herramienta/portal) |
| inkscape.org | 1 | no juego (software/herramienta/portal) |
| shotcut.org | 1 | no juego (software/herramienta/portal) |
| audiomass.co | 1 | no juego (software/herramienta/portal) |
| obsproject.com | 1 | no juego (software/herramienta/portal) |
| blender.org | 1 | no juego (software/herramienta/portal) |
| sweethome3d.com | 1 | no juego (software/herramienta/portal) |
| freecad.org | 1 | no juego (software/herramienta/portal) |
| guitarix.org | 1 | no juego (software/herramienta/portal) |
| leocad.org | 1 | no juego/herramienta/privacidad |
| tytel.org | 1 | no juego/herramienta/privacidad |
| musescore.org | 1 | no juego (software/herramienta/portal) |
| lenmus.org | 1 | no juego (software/herramienta/portal) |
| raspberrypi.com | 1 | no juego (software/herramienta/portal) |
| pianobooster.org | 1 | no juego/herramienta/privacidad |
| ubuntu.com | 1 | no juego (software/herramienta/portal) |
| ultimaker.com | 1 | no juego (software/herramienta/portal) |
| elementary.io | 1 | no juego (software/herramienta/portal) |
| fedoraproject.org | 1 | no juego (software/herramienta/portal) |
| retrovirtualmachine.org | 1 | no juego (software/herramienta/portal) |
| mixxx.org | 1 | no juego (software/herramienta/portal) |
| recalbox.com | 1 | no juego (software/herramienta/portal) |
| retropie.org.uk | 1 | no juego (software/herramienta/portal) |
| cueprompter.com | 1 | no juego/herramienta/privacidad |
| unrealengine.com | 1 | no juego (software/herramienta/portal) |
| reaper.fm | 1 | no juego (software/herramienta/portal) |
| nfb.ca | 1 | no juego (software/herramienta/portal) |
| clipchamp.com | 1 | no juego (software/herramienta/portal) |
| camerasim.com | 1 | no juego/herramienta/privacidad |
| clideo.com | 1 | no juego/herramienta/privacidad |
| brickfilms.com | 1 | no juego/herramienta/privacidad |
| zu3d.com | 1 | no juego/herramienta/privacidad |
| riverside.fm | 1 | no juego (software/herramienta/portal) |
| wikiflix.toolforge.org | 1 | no juego/herramienta/privacidad |
| stopmotionmagazine.com | 1 | no juego/herramienta/privacidad |
| animashooter.ru | 1 | no juego/herramienta/privacidad |
| blackmagicdesign.com | 1 | no juego (software/herramienta/portal) |
| dragonframe.com | 1 | no juego (software/herramienta/portal) |
| animatron.com | 1 | no juego (software/herramienta/portal) |
| color.adobe.com | 1 | no juego (software/herramienta/portal) |
| photopea.com | 1 | no juego (software/herramienta/portal) |
| jahshaka.com | 1 | no juego (software/herramienta/portal) |
| artweaver.de | 1 | no juego (software/herramienta/portal) |
| firealpaca.com | 1 | no juego (software/herramienta/portal) |
| hollywoodcamerawork.com | 1 | no juego/herramienta/privacidad |
| wonderunit.com | 1 | no juego (software/herramienta/portal) |
| stephaneginier.com | 1 | no juego (software/herramienta/portal) |
| pexels.com | 1 | no juego (software/herramienta/portal) |
| static.makehumancommunity.org | 1 | no juego (software/herramienta/portal) |
| webdesigner.withgoogle.com | 1 | no juego (software/herramienta/portal) |
| pbs.org | 1 | no juego (software/herramienta/portal) |
| consellantonigaudi.cat | 1 | no juego/herramienta/privacidad |
| cervantesenlaescuela.es | 1 | no juego/herramienta/privacidad |
| lapedrera.com | 1 | no juego (software/herramienta/portal) |
| oceanicas.ieo.es | 1 | no juego (software/herramienta/portal) |
| educa.sagradafamilia.org | 1 | no juego (software/herramienta/portal) |
| cervantesvirtual.com | 1 | no juego (software/herramienta/portal) |
| fisiquimicamente.com | 1 | no juego (software/herramienta/portal) |
| mortadelo-filemon.es | 1 | no juego (software/herramienta/portal) |
| galeriametges.cat | 1 | no juego/herramienta/privacidad |
| kapralova.org | 1 | no juego/herramienta/privacidad |
| experiments.withgoogle.com | 1 | no juego (software/herramienta/portal) |
| uploads.knightlab.com | 1 | no juego (software/herramienta/portal) |
| recercaiuniversitats.gencat.cat | 1 | portal contenido |
| hallo.beethoven.de | 1 | no juego (software/herramienta/portal) |
| cite-sciences.fr | 1 | no juego (software/herramienta/portal) |
| dones.gencat.cat | 1 | portal contenido |
| schulzmuseum.org | 1 | no juego (software/herramienta/portal) |
| fmirobcn.org | 1 | no juego (software/herramienta/portal) |
| museovangogh.org | 1 | no juego (software/herramienta/portal) |
| beatlesstory.com | 1 | no juego (software/herramienta/portal) |
| cidob.org | 1 | no juego/herramienta/privacidad |
| historiaycomic.wordpress.com | 1 | no juego (software/herramienta/portal) |
| gomic.eu | 1 | no juego (software/herramienta/portal) |
| educacionplasticayvisual.com | 1 | no juego (software/herramienta/portal) |
| storyboardthat.com | 1 | no juego (software/herramienta/portal) |
| comicat.cat | 1 | no juego (software/herramienta/portal) |
| asterix.com | 1 | no juego (software/herramienta/portal) |
| lambiek.net | 1 | no juego (software/herramienta/portal) |
| tebeosfera.com | 1 | no juego (software/herramienta/portal) |
| canva.com | 1 | no juego (software/herramienta/portal) |
| digitalcomicmuseum.com | 1 | no juego (software/herramienta/portal) |
| edit.org | 1 | no juego (software/herramienta/portal) |
| voki.com | 1 | no juego (software/herramienta/portal) |
| distrosea.com | 1 | no juego (software/herramienta/portal) |
| web-rewind.com | 1 | no juego (software/herramienta/portal) |
| macintoshrepository.org | 1 | no juego (software/herramienta/portal) |
| torinak.com | 1 | no juego (software/herramienta/portal) |
| blankpage.im | 1 | no juego (software/herramienta/portal) |
| opengameart.org | 1 | no juego/herramienta/privacidad |
| habisoft.com | 1 | no juego (software/herramienta/portal) |
| flowlab.io | 1 | no juego (software/herramienta/portal) |
| figuro.io | 1 | no juego (software/herramienta/portal) |
| tv.garden | 1 | no juego/herramienta/privacidad |
| bricklink.com | 1 | no juego/herramienta/privacidad |
| clp.bbcrewind.co.uk | 1 | no juego/herramienta/privacidad |
| timeline.knightlab.com | 1 | no juego (software/herramienta/portal) |
| inklestudios.com | 1 | no juego (software/herramienta/portal) |
| elementari.com | 1 | no juego (software/herramienta/portal) |
| panzoid.com | 1 | no juego (software/herramienta/portal) |
| kassellabs.io | 1 | no juego (software/herramienta/portal) |
| bbcmicro.co.uk | 1 | no juego (software/herramienta/portal) |
| jamesfriend.com.au | 1 | no juego (software/herramienta/portal) |
| chromeenterprise.google | 1 | no juego/herramienta/privacidad |
| pokecardmaker.com | 1 | no juego/herramienta/privacidad |
| archive.org | 1 | no juego/herramienta/privacidad |
| typewritesomething.com | 1 | no juego (software/herramienta/portal) |
| radio.garden | 1 | no juego/herramienta/privacidad |
| doppelme.com | 1 | no juego (software/herramienta/portal) |
| pcjs.org | 1 | no juego (software/herramienta/portal) |
| thingiverse.com | 1 | no juego (software/herramienta/portal) |
| cospaces.io | 1 | no juego (software/herramienta/portal) |
| geocaching.com | 1 | no juego (software/herramienta/portal) |
| ca.wikiloc.com | 1 | no juego (software/herramienta/portal) |
| dj.app | 1 | no juego (software/herramienta/portal) |
| volcanesdecanarias.org | 1 | no juego/herramienta/privacidad |
| arcgis.com | 1 | no juego (software/herramienta/portal) |
| bgs.ac.uk | 1 | no juego (software/herramienta/portal) |
| ign.es | 1 | no juego (software/herramienta/portal) |
| volcano.oregonstate.edu | 1 | no juego (software/herramienta/portal) |
| volcano.si.edu | 1 | no juego (software/herramienta/portal) |
| projectes.xtec.cat | 1 | no juego (software/herramienta/portal) |
| aepd.es | 1 | no juego/herramienta/privacidad |
| apdcat.gencat.cat | 1 | portal contenido |
| cuidadoconlawebcam.com | 1 | no juego/herramienta/privacidad |
| learntocheck.org | 1 | no juego/herramienta/privacidad |
| lykio-dev-data.s3.eu-central-1.amazonaws.com | 1 | no juego/herramienta/privacidad |
| es.greenpeace.org | 1 | no juego (software/herramienta/portal) |
| impactlab.org | 1 | no juego (software/herramienta/portal) |
| interactive-atlas.ipcc.ch | 1 | no juego (software/herramienta/portal) |
| earthobservatory.nasa.gov | 1 | no juego (software/herramienta/portal) |
| graphoverflow.com | 1 | no juego (software/herramienta/portal) |
| iypt2019.org | 1 | no juego (software/herramienta/portal) |
| 52gamespt.wordpress.com | 1 | no juego (software/herramienta/portal) |
| rsc.org | 1 | no juego (software/herramienta/portal) |
| compoundchem.com | 1 | no juego (software/herramienta/portal) |
| elements.wlonk.com | 1 | no juego (software/herramienta/portal) |
| termcat.cat | 1 | no juego (software/herramienta/portal) |
| enciclopedia.cat | 1 | no juego (software/herramienta/portal) |
| projectes.edigital.cat | 1 | no juego/herramienta/privacidad |
| sinonims.iec.cat | 1 | no juego (software/herramienta/portal) |
| dcvb.iec.cat | 1 | no juego (software/herramienta/portal) |
| dle.rae.es | 1 | no juego (software/herramienta/portal) |
| decat.iec.cat | 1 | no juego (software/herramienta/portal) |
| oncat.iec.cat | 1 | no juego (software/herramienta/portal) |
| joc-cooperatives.lovable.app | 1 | no juego/herramienta/privacidad |
| calcul.my.canva.site | 1 | no juego/herramienta/privacidad |
| gemini.google.com | 1 | no juego (software/herramienta/portal) |
| chatgpt.com | 1 | no juego (software/herramienta/portal) |

## 4. Flash casual no educativo (local)

*1 dominios, 205 juegos*

| Dominio | Juegos | Motivo |
|---|---|---|
| (local-swf) | 205 | flash casual no educativo |

## 5. Juegos casuales / entretenimiento con publicidad (privacidad+contenido)

*32 dominios, 156 juegos*

| Dominio | Juegos | Motivo |
|---|---|---|
| arbolabcgames.top | 38 | privacidad/contenido |
| juegosinfantiles.bosquedefantasias.com | 26 | privacidad/contenido |
| mundoprimaria.com | 12 | privacidad/contenido |
| media.safekidgames.com | 12 | privacidad/contenido |
| plays.org | 9 | privacidad/contenido |
| logicieleducatif.fr | 8 | privacidad/contenido |
| apprendrealire.net | 6 | privacidad/contenido |
| tipirate.net | 5 | privacidad/contenido |
| mrnussbaum.com | 4 | privacidad/contenido |
| cdn2.kidmons.com | 4 | privacidad/contenido |
| jeux-pour-tablette.fr | 4 | privacidad/contenido |
| cokitos.com | 4 | privacidad/contenido |
| cdn.primarygames.com | 3 | privacidad/contenido |
| toytheater.com | 2 | privacidad/contenido |
| funbrain.com | 2 | privacidad/contenido |
| chess.com | 1 | privacidad/contenido |
| bomomo.com | 1 | privacidad/contenido |
| juegos.com | 1 | privacidad/contenido |
| elbuhoboo.com | 1 | privacidad/contenido |
| topster.es | 1 | privacidad/contenido |
| freepacman.org | 1 | privacidad/contenido |
| jigzone.com | 1 | privacidad/contenido |
| sudoku-online.org | 1 | privacidad/contenido |
| arbolabc.com | 1 | privacidad/contenido |
| jigsawplanet.com | 1 | privacidad/contenido |
| friv.com | 1 | privacidad/contenido |
| games.gameboss.com | 1 | privacidad/contenido |
| cdn-factory.marketjs.com | 1 | privacidad/contenido |
| educatifenfants.com | 1 | privacidad/contenido |
| coolmath4kids.com | 1 | privacidad/contenido |
| juegosarcoiris.com | 1 | privacidad/contenido |
| aicomicfactory.com | 1 | privacidad/contenido |

## Dominios que se mantienen (🟢)

*59 dominios, 1978 juegos*

| Dominio | Juegos | Nota |
|---|---|---|
| clic.xtec.cat | 1317 | JClic XTEC institucional |
| jclic.edutictac.es | 331 | autoalojado propio |
| edu365.cat | 101 | Generalitat (verificar enlaces) |
| bilateria.org | 61 | web docente/institucional sin registro (revisar) |
| educaixa.org | 24 | institucional sin registro |
| vedoque.com | 13 | sin publicidad ni registro |
| gencat.cat | 9 | institucional (revisar si es juego) |
| educ.ar | 8 | institucional |
| raultorres-ia.github.io | 7 | web docente/institucional sin registro (revisar) |
| educaplus.org | 6 | sin publicidad |
| sasogu.github.io | 6 | web docente/institucional sin registro (revisar) |
| eboixader.github.io | 6 | web docente/institucional sin registro (revisar) |
| scratch.mit.edu | 5 | juego/actividad navegador sin registro |
| learnenglishkids.britishcouncil.org | 5 | institucional |
| teachingmoney.co.uk | 5 | sin publicidad ni registro |
| felipsarroca.github.io | 5 | web docente/institucional sin registro (revisar) |
| jjdeharo.github.io | 5 | web docente/institucional sin registro (revisar) |
| edutictac.es | 4 | propio |
| gamedata.britishcouncil.org | 4 | institucional |
| fun4thebrain.com | 4 | sin registro ni coste |
| www3.gobiernodecanarias.org | 3 | institucional |
| arcademics.com | 3 | sin publicidad ni registro |
| thatquiz.org | 2 | sin registro |
| blockly.games | 2 | juego/actividad navegador sin registro |
| studio.code.org | 2 | juego/actividad navegador sin registro |
| musiclab.chromeexperiments.com | 2 | juego/actividad navegador sin registro |
| botlogic.us | 2 | juego/actividad navegador sin registro |
| mediasmarts.ca | 2 | ONG |
| beinternetawesome.withgoogle.com | 2 | juego Interland |
| paxigames.esa.int | 2 | web docente/institucional sin registro (revisar) |
| emmarin04.github.io | 2 | web docente/institucional sin registro (revisar) |
| eduhoot.edutictac.es | 1 | propio |
| educativo.ign.es | 1 | juego/actividad navegador sin registro |
| interactive.sesamestreet.org | 1 | web docente/institucional sin registro (revisar) |
| thinkuknow.co.uk | 1 | institucional |
| cyberscouts.osi.es | 1 | institucional |
| tvokids.com | 1 | web docente/institucional sin registro (revisar) |
| apliedu.xtec.cat | 1 | XTEC institucional |
| spaceplace.nasa.gov | 1 | juego/actividad navegador sin registro |
| grinchhourofcode.com | 1 | juego/actividad navegador sin registro |
| play.elevatorsaga.com | 1 | juego/actividad navegador sin registro |
| supercodingball.com | 1 | juego/actividad navegador sin registro |
| flukeout.github.io | 1 | juego/actividad navegador sin registro |
| flexboxfroggy.com | 1 | juego/actividad navegador sin registro |
| makecode.microbit.org | 1 | juego/actividad navegador sin registro |
| crunchzilla.com | 1 | juego/actividad navegador sin registro |
| runmarco.allcancode.com | 1 | juego/actividad navegador sin registro |
| arcade.makecode.com | 1 | juego/actividad navegador sin registro |
| kids.csic.es | 1 | juego/actividad navegador sin registro |
| scienceinschool.org | 1 | institucional sin publicidad |
| ciberseguretat.gencat.cat | 1 | institucional |
| es.kiddle.co | 1 | buscador infantil seguro |
| pantallasamigas.net | 1 | institucional |
| netsmartzkids.org | 1 | institucional |
| incibe.es | 1 | institucional |
| ptable.com | 1 | juego/actividad navegador sin registro |
| ed.ted.com | 1 | sin publicidad |
| edimarkweb.github.io | 1 | web docente/institucional sin registro (revisar) |
| edicuatex.github.io | 1 | web docente/institucional sin registro (revisar) |

## Enlaces rotos entre los que se MANTIENEN (revisar)

47 URLs marcadas como error/aviso por el verificador. **Ojo**: el verificador hace peticiones HTTP que algunos sitios institucionales bloquean (p. ej. educaixa.org devuelve 403 a bots aunque la web carga en navegador). Verificar manualmente antes de borrar.

- `https://edutictac.es/inici/flash/aulademusica24aranas.swf`
- `https://edutictac.es/inici/flash/aulademusicaenriqueta.swf`
- `https://edutictac.es/inici/flash/pajarologia.swf`
- `https://educaixa.org/microsites/KitsCaixa_valores/cualidades_personales_autorretrato/Contenidos/recursos_aux/index.html`
- `https://www.teachingmoney.co.uk/tasters/fractionfreeze.html`
- `https://educaixa.org/microsites/pixar/crea_tu_personaje/`
- `https://educaixa.org/microsites/KitsCaixa_valores/cualidades_personales_valoracion_cualidades/Contenidos/recursos_aux/index.html`
- `https://educaixa.org/microsites/Programa%20BigData/Infografias%20interactivas%20ESP/B4U1_es/index.html`
- `https://educaixa.org/microsites/KitsCaixa_valores/emociones%20agradables/Contenidos/recursos_aux/index.html`
- `https://educaixa.org/microsites/KitsCaixa_valores/Emociones_agradables_GE/Contenidos/recursos_aux/index.html`
- `https://educaixa.org/microsites/KitsCaixa_valores/emociones_basicas/Contenidos/recursos_aux/index.html`
- `https://educaixa.org/microsites/KitsCaixa_valores/otras%20emociones%20perturbadoras/Contenidos/recursos_aux/index.html`
- `https://educaixa.org/microsites/KitsCaixa_valores/Emociones_perturbadoras_ninos_ninas/Contenidos/recursos_aux/index.html`
- `https://educaixa.org/microsites/KitsCaixa_valores/Emociones_perturbadoras_con_padres/Contenidos/recursos_aux/index.html`
- `https://educaixa.org/microsites/KitsCaixa_valores/Emociones_perturbadoras_solos/Contenidos/recursos_aux/index.html`
- `https://educaixa.org/microsites/XploreHealth/symphony/EL-JOC-DE-DIRIGIR/ES/index.html`
- `https://educaixa.org/microsites/investiguem_a_primaria/Que_puedo_hacer_para_responder_a_esta_pregunta/index.html`
- `https://educaixa.org/microsites/investiguem_a_primaria/De_las_hipotesis_a_las_predicciones/index.html`
- `https://educaixa.org/microsites/investiguem_a_primaria/Que_hacemos_cuando_investigamos/`
- `https://educaixa.org/microsites/KitsCaixa_valores/emociones%20perturbadoras/Contenidos/recursos_aux/index.html`
- `https://educaixa.org/microsites/investiguem_a_primaria/Evaluamos_un_diseno_experimental_con_control_de_variables/index.html`
- `https://www.teachingmoney.co.uk/tasters/puzzadd.html`
- `https://educaixa.org/microsites/Resolucio_de_conflictes/resolucion_conflict_caso_laura_juan/Contenidos/recursos_aux/index.html`
- `https://educaixa.org/microsites/Resolucio_de_conflictes/resolucion_conflic_caso_monica/Contenidos/recursos_aux/index.html`
- `https://educaixa.org/microsites/Resolucio_de_conflictes/resolucion_conflic_caso_eduardo_guillermo/Contenidos/recursos_aux/index.html`
- `https://www.teachingmoney.co.uk/tasters/irfball.html`
- `https://www.teachingmoney.co.uk/tasters/taketime1.html`
- `https://educaixa.org/microsites/KitsCaixa_valores/visualizacion_4/Contenidos/recursos_aux/index.html`
- `https://educaixa.org/microsites/KitsCaixa_valores/visualizacion_5/Contenidos/recursos_aux/index.html`
- `https://educaixa.org/microsites/KitsCaixa_valores/visualizacion_1/Contenidos/recursos_aux/index.html`
- `https://educaixa.org/microsites/KitsCaixa_valores/visualizacion_3/Contenidos/recursos_aux/index.html`
- `https://www.teachingmoney.co.uk/tasters/wipeoutmnf.html`
- `https://www.kids.csic.es/index.html`
- `https://clic.xtec.cat/projects/solsones/jclic.js/index.html`
- `https://bilateria.org/app/utils_clas/formularios`
- `https://bilateria.org/app/bio/ia_de`
- `https://bilateria.org/app/estudio/tutor_ia_estudio/`
- `https://bilateria.org/aeim`
- `https://bilateria.org/app/estudio/socrates`
- `https://bilateria.org/apps/juegos/ruleta/`
- `https://felipsarroca.github.io/ScapeRoomErmita/`
- `https://felipsarroca.github.io/4x15-Joc-IA/`
- `https://felipsarroca.github.io/SlitherLink/`
- `https://felipsarroca.github.io/Joc-Marc-IA/`
- `https://bilateria.org/app/probabilidad/bayes`
- `https://bilateria.org/app/juegos/rueda`
- `https://bilateria.org/app/juegos/reto/`

## Casos especiales a decidir

1. **youtube.com (60 vídeos)**: se retira por el criterio estricto (trackers, contenido no moderado). Alternativa si se quieren conservar: incrustar solo los vídeos educativos concretos de forma local/autorizada.
2. **Flash local (205)**: juegos `.swf` de Archive.org (PBS Kids y otros) reproducidos con Ruffle. No salen a ningún tercero, pero la mayoría son entretenimiento sin valor curricular y algunos no son aptos (p. ej. *Pico's School*). Se propone retirar el bloque completo salvo que quieras conservar los que tengan intención educativa (mates/ciencias/música, unos 15).
3. **cristic.my.canva.site (108)**: alojado en Canva (trackers) y la portada da 404. Retirar; si las actividades de Cristic son valiosas, reenlazarlas desde su web propia (`cristic.com`) si cumple privacidad.
4. **bilateria.org (52)**: web de docente de secundaria con muchas apps que usan IA generativa. Enlaces en su mayoría vivos, pero conviene revisar si los recursos con IA son adecuados por edad y privacidad.
5. **educaixa.org**: los 24 enlaces están marcados como rotos por el verificador, pero es un falso positivo probable (403 a bots). Mantener y verificar a mano.

## Acción propuesta

1. Revisar este informe y confirmar los bloques a retirar.
2. Aplicar un script de filtrado a `data/games.json` (retirar por dominio/motivo) y regenerar `data/games-home.json` y el informe de enlaces.
3. Verificar manualmente los 47 enlaces dudosos que se mantienen.
