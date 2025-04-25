- clothes images aren't showing
- it need dark mode - done
- emit changes
- show changes

<!--
 we need to change the productCard component to accept clothes logic , wich means :
- not rendering main image , rendering list directly ( calculating if has variants
 - rendering the image list based on the current varient , first varient by default
    - when we change color inside description :
    - the images change
    - the data inside desciption changes (easy)
 
 solution
  define sttings object{
    display main image : false

  }

render_images(){
    if settings.display_main_image == true
        ... add main image
    else 
        ... skip main image

also remove that async images crap , images will be loaded in time [doooonenenen]
    
}
 
  -->