import React from 'react'
import logo from '../assets/logo.png';
import livre from '../assets/livre.jpg';
import symballes from '../assets/symballes.jpg';

export const Bio = () => {
  return (
    <>
    <div className="relative flex py-3 items-center p-5 pt-[100px]">
    <div className="flex-grow border-t border-white mr-1"></div>
      <img src={logo} className="h-[70px] pb-3" alt="logo en gramma" />
    <div className="flex-grow border-t border-white"></div>
  </div>

  <h1 className=" text-white dropshadow-xl animate-fade animate-duration-[2500ms] text-center text-2xl">Bio du projet <span className='font-custom'>EN GRAMMA</span></h1>
  <div className="flex flex-col items-center justify-center sm:flex-row">
  <div className="relative  my-9 ">
    <img src={livre} alt="EN GRAMMA" className="object-cover w-full rounded-lg flex justify-center h-auto max-w-[675px] shadow-xl md:px-0 px-3" />
    <p className="absolute bottom-0 right-0 text-white  px-3 py-1 text-xs">&copy; Antoine Chevillé</p>
  </div>
  </div>
  <div className='max-w-[700px] mx-auto'>
  <p className="text-sm text-white text-justify  mx-3 mb-9 animate-fade-right">
  <div>
    <p>Il y a un peu plus d&#39;une d&eacute;cennie, Gautier Degandt, musicien autodidacte install&eacute; &agrave; Rennes, fonde le groupe <strong>heraclite</strong> qui chante les fragments du philosophe H&eacute;raclite en grec ancien sur une musique post punk tribale enfi&eacute;vr&eacute;e.</p><br/>
    <p>Rep&eacute;r&eacute; par <strong>Stevo Pearce </strong>(manager du groupe <strong>Soft Cell</strong>) du label culte <strong>Some Bizarre Records</strong> (les 1ers albums de <strong>Depeche Mode, Soft Cell, Einst&uuml;rzende Neubauten</strong>...), le groupe sort un single sur ce label puis son 1er album avec les suisses d&#39;<strong>U</strong><strong>rgence disk</strong> et marque les esprits avec des concerts explosifs.</p><br/>
    <p>&Agrave; cette p&eacute;riode Gautier rencontre le bluesman am&eacute;ricain <strong>Seth Augustus</strong> &eacute;l&egrave;ve de <strong>Paul Pena</strong>, le 1er bluesman a avoir fait le pont entre le blues et la musique traditionnelle de Mongolie et de Tuva (cf. <strong>&quot;Genghis Blues&quot;</strong>, un documentaire de Roko Belic). <strong>Seth Augustus</strong> impr&egrave;gne alors Gautier de blues, folk et de chants gutturaux. Ils tournent ensemble en Europe.</p><br/>
    <p>&Agrave; partir de 2013, Gautier fonde avec la chanteuse <strong>Maria Laurent </strong>(<strong>Meikhaneh </strong>chez<strong>&nbsp; Buda Musique</strong>) le duo de nu folk <strong>B&acirc;ton Bleu</strong>. Apr&egrave;s une 1er EP et de nombreuses tourn&eacute;es en Europe, ils sortent leur 1er album en 2018 : <strong>&quot;Weird and Wonderful Tales&quot;</strong> sur le l&eacute;gendaire label <strong>DixieFrog Records</strong> (<strong>Eric Bibb, Carolina Chocolate Drop, 1er album de Leyla MacCalla</strong>...). <strong>fRoots</strong>, l&#39;un des magazines anglais de r&eacute;f&eacute;rence pour la folk et la world musique, encense l&#39;album et son fondateur <strong>Ian Anderson</strong> le qualifie ainsi de <strong>&quot;Favourite new discovery and as original as fuck!&quot;</strong>.</p><br/>
    <p>En 2016, Gautier monte avec Pierre-Yves Dubois, Oscar Phil&eacute;as et Nicolas Maignan un projet qui m&eacute;lange Afro Beat et rock : <strong>Visage Br&ucirc;l&eacute;, </strong>o&ugrave; le grec ancien est m&eacute;lang&eacute; au fran&ccedil;ais et &agrave; l&#39;anglais pour cr&eacute;er un pont entre les cultures et les &eacute;poques dans une &eacute;nergie tr&egrave;s physique. Le groupe sort un EP puis tourne en Italie mais suite &agrave; la mort du bassiste du groupe et ami Nicolas Maignan, Visage Br&ucirc;l&eacute; s&#39;arr&ecirc;te d&eacute;finitivement.</p><br/>
    <p><br />
    En 2021 na&icirc;t alors <strong>En Gramma </strong>( &Egrave;ne Gramma) un trio aux fronti&egrave;res du rock et de la musique du monde. A nouveau le grec ancien, le fran&ccedil;ais et l&#39;anglais sont m&eacute;lang&eacute;s dans une musique &eacute;pur&eacute;e et sensuelle, transe et incantatoire.</p><br/>
    <p>On y retrouve <strong>Gautier Degandt </strong>au chant&nbsp; avec&nbsp;les deux autres anciens membres de<strong>Visage Br&ucirc;l&eacute;: </strong>&nbsp;<strong>Oscar Phil&eacute;as</strong> &agrave;laguitare et aux choeurs qui navigue de l&#39;&eacute;lectrique &agrave; l&#39;acoustique, synth&eacute;tisant ainsi ses multiples exp&eacute;riences en rock, chanson fran&ccedil;aise et musiques africaines (<strong>Mamadou Koita</strong>) et <strong>Pierre-Yves Dubois</strong> &agrave; la batterie, percussions, violon et choeurs qui est &eacute;galement compositeur et interpr&egrave;te de musique de film. Celui-ci r&eacute;alise aussi une grande partie des visuels du groupe.</p>
</div>

    </p>
  </div>

  <div className="relative flex py-3 items-center p-5 ">
    <div className="flex-grow border-t border-white mr-1"></div>
      <img src={logo} className="h-[70px] pb-3" alt="logo en gramma" />
    <div className="flex-grow border-t border-white"></div>
  </div>

  <h1 className="text-white dropshadow-xl animate-fade animate-duration-[2500ms] text-center text-2xl">
  Au sujet de l'album{' '} {/* Add a space here */}
  <span className='font-custom'>BEAU BRÛLIS</span>
</h1>

  <div className="flex flex-col items-center justify-center sm:flex-row">
  <div className="relative  my-9 ">
    <img src={symballes} alt="EN GRAMMA" className="object-cover w-full rounded-lg flex justify-center h-auto max-w-[675px] shadow-xl md:px-0 px-3" />
    <p className="absolute bottom-0 right-0 text-white  px-3 py-1 text-xs">&copy; Antoine Chevillé</p>
  </div>
  </div>
  <div className='max-w-[700px] mx-auto'>
  <p className="text-sm text-white text-justify  mx-3 mb-9 animate-fade-right">
      <p><strong>Le premier album de EN GRAMMA &quot;Beau Br&ucirc;lis&quot; aborde le th&egrave;me du renouveau, de la vie apr&egrave;s la destruction. Le br&ucirc;lis du titre &eacute;voque &quot;la culture sur br&ucirc;lis&quot;, une technique agricole o&ugrave; l&#39;on br&ucirc;le le sol pour le fertiliser.</strong></p><br/>
      <p>La production immersive et intimiste, apporte une exp&eacute;rience &eacute;motionnellegr&acirc;ce au voix chaudes et englobantes accompagn&eacute;es par des percussions vibrantes telles que le Bombo (percussion sud-am&eacute;ricaine) qui remplace la grosse caisse, la calebasse ou l&#39;utilisation de claps et de shekere ou encore le daf iranien. Les passages entre la guitare acoustique et la guitare &eacute;lectrique abrasive y ajoutent une grande dynamique.</p><br/>
      <p>L&#39;album a &eacute;t&eacute; produit et mix&eacute; par Gautier Degandt qui, comme pour l&#39;album <strong>Weird and Wonderful Tales </strong>de<strong>B&acirc;ton Bleu</strong>, en a &eacute;t&eacute; le r&eacute;alisateur artistique.</p><br/>
      <p><strong>L&#39;album a &eacute;t&eacute; masteris&eacute;</strong>par Blanka au studio Kasablanka Mastering (de <strong>la Fine &eacute;quipe</strong>) qui a &eacute;galement r&eacute;alis&eacute; le mastering de l&#39;album <strong>Weird and Wonderful Tales&rdquo; </strong>de <strong>B&acirc;ton Bleu.</strong></p><br/>
      <p><strong>Beau Br&ucirc;lis </strong>est d&eacute;dicac&eacute; &agrave; la m&eacute;moire du bassiste Nicolas Maignan.</p>

    </p>
  </div>
  </>
  )
}
