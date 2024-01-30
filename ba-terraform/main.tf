terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
  }
}

provider "azurerm" {
  features {}
}

data "azurerm_resource_group" "existing" {
  name = "brainacademy"
}

resource "azurerm_kubernetes_cluster" "brainacademyAKSCluster" {
  name                = "brainacademyAKSCluster"
  location            = element(azurerm_resource_group.brainacademy.*.location, 0)
  resource_group_name = element(azurerm_resource_group.brainacademy.*.name, 0)
  dns_prefix          = "brainacademy-aks"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DS2_v2"
  }

  service_principal {
    client_id     = "31223feb-f232-48cd-ba1c-7282b1061d33"
    client_secret = "MQk8Q~44wHSP~G3iwV28BhWQU_gmqD57kjJIhaCL"
  }
}