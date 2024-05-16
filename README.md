# Mon premier jeu qui peut être fini ! (Full JavaScript)

## Comment le cloner ?

Trouvez un beau dossier et clonez le avec cette commande :

```git clone git@github.com:hrltKillian/game_maze_traveler.git```

## Les règles du jeu

Le but du jeu est de traverser les **38** labyrinthes **en fesant le moins de mouvement possible** pour avoir le **score le plus petit**.

A chaque niveau, la taille du labyrinthe augmente de 1 et ce jusqu'à 38 (de **3x3** jusqu'à **40x40**)

**Tout les labyrinthes** sont pensés pour **être fini** sinon il est automatiquement changé jusqu'à qu'il y en ai un de faisable.

Si vous touchez un mur ou un rebors, le robot revient immédiatement au point de départ mais les coups restent enregistrés dans le comptage du score.

Vous pouvez appuyer sur les flèches dans les div ou alors sur les touches **q**, **z** et **d** pour faire les actions suivante : **Tourner vers la gauche**, **Avancer dans la direction du robot**, **Tourner vers la droite**.

## Les aides à dispositions

Il existe quelques aides mises à disposition pour vous aidez dans votre aventure :

- Le bouton **Annuler** qui permet de supprimer la dernière prédiction faites.
- Le bouton **Effacer** qui permet de supprimer tout la liste de prédiction.
- Le **clique droit sur un chemin** vous permet de mettre ce dernier en bleu pour mieux vous repérer dans le dédale.


> Pour les plus téméraires, il existe une fonction qui permet de résoudre le labyrinthe sans rien faire mais il va falloir s'aventurer dans le code pour réussir à l'activer

## Bon jeu !

©Killian Herlant 17/05/2024 01:25
```
  _      _   _   _   _                     _                     _                   _   
 | | __ (_) | | | | (_)   __ _   _ __     | |__     ___   _ __  | |   __ _   _ __   | |_ 
 | |/ / | | | | | | | |  / _` | | '_ \    | '_ \   / _ \ | '__| | |  / _` | | '_ \  | __|
 |   <  | | | | | | | | | (_| | | | | |   | | | | |  __/ | |    | | | (_| | | | | | | |_ 
 |_|\_\ |_| |_| |_| |_|  \__,_| |_| |_|   |_| |_|  \___| |_|    |_|  \__,_| |_| |_|  \__|
 ```