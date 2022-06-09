  
  
// GENERATE NEW RELEASE NOTE TEMPLATE
  const create_release_draft = (commits_arry, last_r_t)=>{
    opening =`# New Release ${last_r_t} :fire: \n`
    middle = '# Contriber : \n'
    changelog = '## ChangeLog: \n'
    mod_files = []
    add_files = []
    rm_files = []


    for(const element of commits_arry){
      opening +=`:sparkles: **${element[0].message}** :  commit by - **${element[0].author.name}**   \n`
      middle += `:sparkles: **${element[0].author.name}** :  \n`
      if(element[0].added.length != 0){
        add_files.push(element[0].added)
        // changelog += `added **${element.added}** :  \n`
      }
      if(element[0].removed.length){
        rm_files.push(element[0].removed)
        // changelog += `removed **${element.removed}** :  \n`
      }
      if(element[0].modified.length){
        mod_files.push(element[0].modified)
        // changelog += `modified **${element.modified}** :  \n`
      }
    };
    if (add_files.length != 0) {
      changelog += `Added Files:  **[${add_files}]** :  \n`
    }
    if (rm_files.length != 0) {
      changelog += `Removed Files: **[${rm_files}]** :  \n`
    }
    if (mod_files.length != 0) {
      changelog += `Modified Files: **[${mod_files}]** :  \n`
    }
    finel =  opening+middle+changelog
    return finel
  }


  exports.create_release_draft = create_release_draft