import React from 'react'
import spaceimage from '../assets/spaceimage.webp';

export const Privacy = () => {
  return (
    <div className="relative" style={{backgroundImage: `url(${spaceimage})`, backgroundSize: 'contain'}}>
      <div class="max-w-2xl mx-auto py-8 px-4 text-white pt-[100px] z-10 relative overflow-y-auto no-scrollbar">
    <h1 class="text-3xl font-bold mb-4">Politique de confidentialité <span className='font-custom'>EN GRAMMA</span></h1>
    <p class="mb-4">La confidentialité et la sécurité des données de nos utilisateurs sont des priorités absolues pour nous. Cette politique de confidentialité explique notre engagement à protéger vos informations lorsque vous utilisez notre site web.</p>

    <h2 class="text-xl font-bold mb-2">1. Utilisation de cookies essentiels :</h2>
    <p class="mb-4">Nous utilisons uniquement des cookies essentiels pour assurer le bon fonctionnement de notre site. Ces cookies sont sécurisés et ne collectent aucune donnée personnelle identifiable. Ils sont essentiels pour vous permettre de naviguer sur notre site et d'accéder à ses fonctionnalités.</p>

    <h2 class="text-xl font-bold mb-2">2. Aucune collecte de données personnelles à des fins commerciales :</h2>
    <p class="mb-4">Nous vous assurons que nous ne collectons aucune donnée à des fins commerciales. Vos informations personnelles ne sont pas vendues, échangées, ni louées à des tiers. Nous ne recueillons aucune donnée, sous quelque forme que ce soit, auprès de nos visiteurs, en dehors de celles nécessaires au bon fonctionnement du site.</p>

    <h2 class="text-xl font-bold mb-2">3. YouTube :</h2>
    <p class="mb-4">Nous utilisons YouTube pour héberger des vidéos. YouTube peut collecter des données sur votre interaction avec ces vidéos. Nous vous recommandons de consulter la politique de confidentialité de YouTube pour plus d'informations.</p>

    <h2 class="text-xl font-bold mb-2">4. Bandcamp :</h2>
    <p class="mb-4">Nous utilisons Bandcamp pour héberger de la musique. Bandcamp peut collecter des données sur votre interaction avec cette musique. Nous vous recommandons de consulter la politique de confidentialité de Bandcamp pour plus d'informations.</p>

    <p class="mb-4">En utilisant notre site, vous consentez à notre politique de confidentialité. Si vous avez des questions ou des préoccupations concernant cette politique, veuillez nous contacter à l'adresse <span class="font-semibold text-orange2">univergram.asso@gmail.com</span>.</p>

    <p class="mb-4">Date d'entrée en vigueur : <span class="font-semibold">14/02/2024</span></p>
</div>
    </div>
  )
}
